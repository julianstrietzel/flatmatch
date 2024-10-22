import { IFlatProfile, ISearchProfile } from "../models/profileModel";
import { Types } from "mongoose";
import { create, all, Matrix } from "mathjs";
import { CommProfile } from "../controllers/matchingController";

const math = create(all);

// Interface for reduced profile to be used in the MatchingService for smaller memory footprint
export interface IReducedProfile {
  _id: string;
  requirements: {
    reqKey: string;
    weight: number;
  }[];
  tags: {
    tagKey: string;
  }[];
  price?: number;
  status: "active" | "inactive";
}

/**
 * MatchingService class is responsible for matching flat profiles with search profiles
 * based on tags and requirements. It maintains matrices for tags and requirements
 * for both flats and tenants, calculates rankings based on a weighted scoring system,
 * and provides methods to retrieve the best matches.
 *
 * To apply a weighted sum match rating algorithm for matching flats with tenants, we follow these steps:
 *
 * Define the tags and requirements:
 * List all possible tags for flats (e.g., balcony, pet-friendly, furnished).
 * List all possible tags for tenants (e.g., smoker, pet owner, requires parking).
 *
 * Assign weights to each tag:
 * Determine the importance of each tag for both flats and tenants. These weights can be assigned based on
 * a predefined scale (e.g., 1 to 5, where 5 is very important and 1 is not important).
 *
 * Create binary tag matrices:
 * For each flat, create a binary vector representing the presence or absence of each tag.
 * For each tenant, create a binary vector representing their requirements or preferences.
 *
 * Calculate match scores:
 * For each tenant and flat pair, compute the weighted sum of matching tags.
 *
 * This matching service is a somewhat optimized and scalable implementation of the above algorithm,
 * with the ability to add or update profiles
 */
class MatchingService {
  public readonly beta: number; // Coefficient for weighting the ranking matrices

  public availableFlatTags: string[]; // Available tags for flats
  public availableSearchTags: string[]; // Available tags for search profiles

  public flatTagMap: Map<string, number>; // Map of flat tags to their indices in the matrices
  public searchTagMap: Map<string, number>; // Map of search tags to their indices

  public flatIndexMapping: Map<string, number>; // Mapping of flat profile IDs to their indices in the matrices
  public searchIndexMapping: Map<string, number>; // Mapping of search profile IDs to their indices

  public readonly flatProfiles: IReducedProfile[]; // Array of reduced flat profiles containing relevant information for matching only
  public readonly searchProfiles: IReducedProfile[]; // Array of reduced search profiles

  // The requirements for each profile (row) are stored as integer weights (0-5) for each tag (column)
  public flatRequirementsMatrix;
  public searchRequirementsMatrix;

  // The tags for each profile (row) are stored as binary vectors for each tag (column)
  public flatTagsMatrix;
  public searchTagsMatrix;

  // @ts-expect-error As we are initializing the matrix in a method called by the constructor, we can ignore the error
  public flatRanking: Matrix; // Matrix for flat rankings
  // @ts-expect-error As we are initializing the matrix in a method called by the constructor, we can ignore the error
  public searchRanking: Matrix; // Matrix for search rankings

  /**
   * Constructor for MatchingService
   * @param flatProfiles Array of flat profiles
   * @param searchProfiles Array of search profiles
   * @param flatTags Array of available flat tags
   * @param searchTags Array of available search tags
   * @param beta Coefficient for weighting the ranking matrices (default: 0.3)
   *  ranking of flats e.g. is defined by the matching score of the flat with the tenant requirements
   *  and beta times the matching score of the tenant with the flat requirements "I also want my tenant to like me"
   */
  constructor(
    flatProfiles: IFlatProfile[],
    searchProfiles: ISearchProfile[],
    flatTags: string[],
    searchTags: string[],
    beta = 0.3
  ) {
    this.beta = beta;
    this.availableFlatTags = flatTags;
    this.availableSearchTags = searchTags;

    // Initialize flatTagMap and searchTagMap with indices
    this.flatTagMap = new Map<string, number>();
    this.availableFlatTags.forEach((tag: string, index: number) => {
      this.flatTagMap.set(tag, index);
    });

    this.searchTagMap = new Map<string, number>();
    this.availableSearchTags.forEach((tag: string, index: number) => {
      this.searchTagMap.set(tag, index);
    });

    // Reduce profiles for easier processing
    this.flatProfiles = flatProfiles.map((profile) => reduceProfile(profile));
    this.searchProfiles = searchProfiles
      .map((profile) => reduceProfile(profile))
      .filter((profile) => profile.status === "active");

    // Initialize index mappings
    this.flatIndexMapping = new Map<string, number>();
    this.searchIndexMapping = new Map<string, number>();

    this.flatProfiles.forEach((profile, index) => {
      this.flatIndexMapping.set(profile._id.toString(), index);
    });
    this.searchProfiles.forEach((profile, index) => {
      this.searchIndexMapping.set(profile._id.toString(), index);
    });

    // Initialize matrices
    this.flatTagsMatrix = math.matrix(
      math.zeros([this.flatProfiles.length, this.availableFlatTags.length])
    );
    this.searchTagsMatrix = math.matrix(
      math.zeros([this.searchProfiles.length, this.availableSearchTags.length])
    );
    this.flatRequirementsMatrix = math.matrix(
      math.zeros([this.flatProfiles.length, this.availableSearchTags.length])
    );
    this.searchRequirementsMatrix = math.matrix(
      math.zeros([this.searchProfiles.length, this.availableFlatTags.length])
    );

    // Populate matrices and initialize rankings
    this.populateMatrices();
    this.initRankings();
  }

  /**
   * Populate the tag and requirement matrices for all profiles.
   * This method initializes the matrices that store the tags and requirements
   * for both flat and search profiles.
   */
  private populateMatrices() {
    this.flatProfiles.forEach((profile, index) => {
      this.populateFlatTagsAndReqMatrix(profile, index);
    });

    this.searchProfiles.forEach((profile, index) => {
      this.populateTenantTagsAndReqMatrix(profile, index);
    });
  }

  /**
   * Populate the tag and requirement matrices for a search profile.
   * @param profile The search profile
   * @param index The index of the profile in the array
   */
  private populateTenantTagsAndReqMatrix(
    profile: IReducedProfile | ISearchProfile,
    index: number
  ) {
    profile.tags.forEach((tag) => {
      const tagIndex = this.searchTagMap.get(tag.tagKey);
      if (tagIndex !== undefined) {
        this.searchTagsMatrix.set([index, tagIndex], 1);
      }
    });
    profile.requirements.forEach((req) => {
      const reqIndex = this.flatTagMap.get(req.reqKey);
      if (reqIndex !== undefined) {
        this.searchRequirementsMatrix.set([index, reqIndex], req.weight);
      }
    });
  }

  /**
   * Populate the tag and requirement matrices for a flat profile.
   * @param profile The flat profile
   * @param index The index of the profile in the array
   */
  private populateFlatTagsAndReqMatrix(
    profile: IReducedProfile | IFlatProfile,
    index: number
  ) {
    profile.tags.forEach((tag) => {
      const tagIndex = this.flatTagMap.get(tag.tagKey);
      if (tagIndex !== undefined) {
        this.flatTagsMatrix.set([index, tagIndex], 1);
      } else {
        console.log(
          "Unknown Flat tag in profile with id : ",
          profile._id,
          tag.tagKey
        );
      }
    });
    profile.requirements.forEach((req) => {
      const reqIndex = this.searchTagMap.get(req.reqKey);
      if (reqIndex !== undefined) {
        this.flatRequirementsMatrix.set([index, reqIndex], req.weight);
      } else {
        console.log(
          "Unknown Tenant tag in requirement of profile with id : ",
          profile._id,
          req.reqKey
        );
      }
    });
  }

  /**
   * Initialize the ranking matrices for flats and tenants.
   * This method calculates the initial ranking scores for both flats and
   * search profiles based on their tags and requirements.
   */
  private initRankings() {
    const matchFlatsToTenantRequirements = math.multiply(
      this.searchRequirementsMatrix,
      math.transpose(this.flatTagsMatrix)
    );

    const matchTenantsToFlatRequirements = math.multiply(
      this.flatRequirementsMatrix,
      math.transpose(this.searchTagsMatrix)
    );

    // Calculate flat rankings
    this.flatRanking = math.add(
      matchFlatsToTenantRequirements,
      math.multiply(this.beta, math.transpose(matchTenantsToFlatRequirements))
    );

    // Calculate search rankings
    this.searchRanking = math.add(
      matchTenantsToFlatRequirements,
      math.multiply(this.beta, math.transpose(matchFlatsToTenantRequirements))
    );
  }

  /**
   * Update scores for a new flat profile.
   * @param flatIndex The index of the flat profile
   */
  private updateScoresNewFlat(flatIndex: number) {
    const matchSingleFlatToTenantRequirements = math.multiply(
      this.searchRequirementsMatrix,
      math.transpose(math.row(this.flatTagsMatrix, flatIndex))
    );

    const matchTenantsToSingleFlatRequirements = math.multiply(
      math.row(this.flatRequirementsMatrix, flatIndex),
      math.transpose(this.searchTagsMatrix)
    );

    const newFlatScores = math.add(
      matchSingleFlatToTenantRequirements,
      math.multiply(
        this.beta,
        math.transpose(matchTenantsToSingleFlatRequirements)
      )
    );

    this.flatRanking.subset(
      math.index(math.range(0, this.searchProfiles.length), flatIndex),
      newFlatScores
    );

    const newTenantScores = math.add(
      matchTenantsToSingleFlatRequirements,
      math.multiply(
        this.beta,
        math.transpose(matchSingleFlatToTenantRequirements)
      )
    );

    this.searchRanking.subset(
      math.index(flatIndex, math.range(0, this.searchProfiles.length)),
      newTenantScores
    );
  }

  /**
   * Update scores for a new tenant profile.
   * @param tenantIndex The index of the tenant profile
   */
  private updateScoresNewTenant(tenantIndex: number) {
    const matchSingleTenantToFlatRequirements = math.multiply(
      this.flatRequirementsMatrix,
      math.transpose(math.row(this.searchTagsMatrix, tenantIndex))
    );

    const matchFlatsToSingleTenantRequirements = math.multiply(
      math.row(this.searchRequirementsMatrix, tenantIndex),
      math.transpose(this.flatTagsMatrix)
    );

    const newFlatScores = math.add(
      matchFlatsToSingleTenantRequirements,
      math.multiply(
        this.beta,
        math.transpose(matchSingleTenantToFlatRequirements)
      )
    );

    this.flatRanking.subset(
      math.index(tenantIndex, math.range(0, this.flatProfiles.length)),
      newFlatScores
    );

    const newTenantScores = math.add(
      matchSingleTenantToFlatRequirements,
      math.multiply(
        this.beta,
        math.transpose(matchFlatsToSingleTenantRequirements)
      )
    );

    this.searchRanking.subset(
      math.index(math.range(0, this.flatProfiles.length), tenantIndex),
      newTenantScores
    );
  }

  /**
   * Get the best flat matches for a given search profile.
   * @param searchId The ID of the search profile
   * @param n The number of results to return (default: 100)
   * @param page The page of results to return (default: 0)
   * @returns An array of the best matching flat profiles
   */
  public getBestFlats(
    searchId: Types.ObjectId | string,
    n: number = 100,
    page: number = 0
  ): CommProfile[] {
    const searchIndex = this.searchIndexMapping.get(searchId.toString());
    if (searchIndex === undefined) {
      throw new Error("Search Profile not found");
    }
    // get the index row of the flatRanking matrix
    const flatRankingArray = math
      .flatten(math.row(this.flatRanking, searchIndex))
      .valueOf();
    const flatScoresWithIndex = flatRankingArray.map(
      (score, index): CommProfile => {
        return {
          score: score as number,
          id: this.flatProfiles[index]._id,
          reducedProfile: this.flatProfiles[index],
          isAd: false,
        };
      }
    );
    flatScoresWithIndex.sort((a, b) => b.score - a.score);
    return flatScoresWithIndex.slice(page * n, (page + 1) * n);
  }

  /**
   * Get the best tenant matches for a given flat profile.
   * @param flatId The ID of the flat profile
   * @param n The number of results to return (default: 5)
   * @param page The page of results to return (default: 0)
   * @returns An array of the best matching search profiles
   */
  public getBestTenants(
    flatId: Types.ObjectId | string,
    n: number = 5,
    page: number = 0
  ): CommProfile[] {
    const flatIndex = this.flatIndexMapping.get(flatId.toString());
    if (flatIndex === undefined) {
      throw new Error("Flat Profile not found");
    }
    const searchRankingArray = math
      .flatten(math.row(this.searchRanking, flatIndex))
      .valueOf();
    const searchScoresWithIndex = searchRankingArray.map(
      (score, index): CommProfile => {
        return {
          score: score as number,
          id: this.searchProfiles[index]._id as string,
          reducedProfile: this.searchProfiles[index],
        };
      }
    );
    searchScoresWithIndex.sort((a, b) => b.score - a.score);
    return searchScoresWithIndex.slice(page * n, (page + 1) * n);
  }

  /**
   * Add or update a flat profile.
   * @param profile The flat profile to add or update
   */
  public addOrUpdateFlatProfile(profile: IFlatProfile) {
    const reducedProfile = reduceProfile(profile);
    let index = this.flatIndexMapping.get(reducedProfile._id);
    if (index === undefined) {
      index = this.flatProfiles.length;
      this.flatProfiles.push(reducedProfile);
      this.flatIndexMapping.set(reducedProfile._id, index);
      // add row to flatTagsMatrix and flatRequirementsMatrix
      this.flatTagsMatrix = math.resize(this.flatTagsMatrix, [
        this.flatProfiles.length,
        this.availableFlatTags.length,
      ]);
      this.flatRequirementsMatrix = math.resize(this.flatRequirementsMatrix, [
        this.flatProfiles.length,
        this.availableSearchTags.length,
      ]);
      // add row to flatRanking and TenantRanking
      this.flatRanking = math.resize(this.flatRanking, [
        this.searchProfiles.length,
        this.flatProfiles.length,
      ]);
      this.searchRanking = math.resize(this.searchRanking, [
        this.flatProfiles.length,
        this.searchProfiles.length,
      ]);
    } else {
      this.flatProfiles[index] = reducedProfile;
    }
    this.populateFlatTagsAndReqMatrix(profile, index);
    this.updateScoresNewFlat(index);
  }

  /**
   * Add or update a search profile.
   * @param profile The search profile to add or update
   */
  public addOrUpdateSearchProfile(profile: ISearchProfile) {
    const reducedProfile = reduceProfile(profile);
    let index = this.searchIndexMapping.get(reducedProfile._id);
    if (index === undefined) {
      index = this.searchProfiles.length;
      this.searchProfiles.push(reducedProfile);
      this.searchIndexMapping.set(reducedProfile._id, index);
      // add row to searchTagsMatrix and searchRequirementsMatrix
      this.searchTagsMatrix = math.resize(this.searchTagsMatrix, [
        this.searchProfiles.length,
        this.availableSearchTags.length,
      ]);
      this.searchRequirementsMatrix = math.resize(
        this.searchRequirementsMatrix,
        [this.searchProfiles.length, this.availableFlatTags.length]
      );
      // add row to searchRanking and flatRanking
      this.searchRanking = math.resize(this.searchRanking, [
        this.flatProfiles.length,
        this.searchProfiles.length,
      ]);
      this.flatRanking = math.resize(this.flatRanking, [
        this.searchProfiles.length,
        this.flatProfiles.length,
      ]);
    } else {
      this.searchProfiles[index] = reducedProfile;
    }
    this.populateTenantTagsAndReqMatrix(profile, index);
    this.updateScoresNewTenant(index);
  }
}

/**
 * Reduce a profile to a simplified form.
 * @param profile The original flat or search profile
 * @returns The reduced profile
 */
export function reduceProfile(
  profile: IFlatProfile | ISearchProfile
): IReducedProfile {
  // Ensure the number of rooms is an integer and does not exceed 10
  const numberOfRooms = Math.min(
    parseInt(profile.numberOfRooms?.toString(), 10),
    10
  );
  const numberOfRoomsTagKey = numberOfRooms.toString();

  // If the profile is an instance of IFlatProfile, add the number of rooms as a tag
  if ((profile as IFlatProfile).price !== undefined) {
    profile.tags.push({ tagKey: numberOfRoomsTagKey });
  }

  // If the profile is an instance of ISearchProfile, add the number of rooms as a requirement with a weight of 10
  if ((profile as ISearchProfile).priceRange !== undefined) {
    profile.requirements.push({
      reqKey: numberOfRoomsTagKey,
      weight: 10,
    });
  }

  return {
    _id: profile._id!.toString(),
    requirements: profile.requirements,
    status: profile.status || "active",
    tags: profile.tags,
    price: (profile as IFlatProfile).price || 0,
  };
}

export default MatchingService;
