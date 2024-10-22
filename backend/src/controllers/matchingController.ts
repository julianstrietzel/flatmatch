import { Request, Response } from "express";
import {
  FlatProfile,
  IFlatProfile,
  ISearchProfile,
  SearchProfile,
} from "../models/profileModel";
import MatchingService, { IReducedProfile } from "../services/matchingService";
import { isValidObjectId, Types } from "mongoose";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RequestError,
} from "../errors";
import { checkMatchingAuth } from "./controllerUtils";
import { AccountModel } from "../models/accountModel";
import { AdModel } from "../models/adModel";

export interface CommProfile {
  score: number;
  id: string;
  reducedProfile: IReducedProfile | null;
  isAd?: boolean;
}

export class MatchingController {
  matchingService: MatchingService | undefined = undefined;
  constructor() {
    this.searchPosthookFunction = this.searchPosthookFunction.bind(this);
    this.flatPosthookFunction = this.flatPosthookFunction.bind(this);
  }
  public flatPosthookFunction(doc: IFlatProfile, next: () => void) {
    this.matchingService!.addOrUpdateFlatProfile(doc);
    next();
  }
  public searchPosthookFunction(doc: ISearchProfile, next: () => void) {
    this.matchingService!.addOrUpdateSearchProfile(doc);
    next();
  }

  public async initialize() {
    const flatProfiles: IFlatProfile[] = await FlatProfile.find();
    const searchProfiles: ISearchProfile[] = await SearchProfile.find();
    console.log(
      `Initializing Matching Service with ${flatProfiles.length} flat profiles ` +
        `and ${searchProfiles.length} search profiles`
    );
    const flatTags: string[] = [
      "Kitchen",
      "Elevator",
      "Guest toilet",
      "Balcony/Terrace",
      "Cellar",
      "Garden/shared use",
      "Barrier-free access",
      "Old-building",
      "Suitable for shared apartment",
      "Pets",
      "Parking Available",
      "Rooftop Access",
      "Nearby Fitness Center",
      "High-speed Internet",
      "Public Transport Nearby",
      "Furnished",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ];
    const searchTags: string[] = [
      "Income Verification",
      "Guarantor",
      "Home insurance",
      "Rental History",
      "SCHUFA",
      "Previous Landlord Reference",
      "Early Bird",
      "Bookworm",
      "Tech Savvy",
      "Social",
      "Gamer",
      "Photographer",
      "Nature Lover",
      "Multilingual",
      "Student",
      "Blogger/Vlogger",
      "Fitness Enthusiast",
      "Music Lover",
      "Foodie",
      "Travel Buff",
      "Animal Lover",
      "DIY Expert",
      "Art Aficionado",
      "History Buff",
      "Science Geek",
      "Fashionista",
      "Green Thumb",
      "Volunteer",
      "Fitness Guru",
      "Movie Buff",
      "Health Nur",
      "Minimalist",
      "Pet Owner",
      "Baker",
      "Chef",
      "Entrepreneur",
    ];
    for (const flatProfile of flatProfiles) {
      for (const tag of flatProfile.tags) {
        if (!flatTags.find((t) => t === tag.tagKey)) {
          flatTags.push(tag.tagKey);
        }
      }
    }
    for (const searchProfile of searchProfiles) {
      for (const tag of searchProfile.tags) {
        if (!searchTags.find((t) => t === tag.tagKey)) {
          searchTags.push(tag.tagKey);
        }
      }
    }
    this.matchingService = new MatchingService(
      flatProfiles,
      searchProfiles,
      flatTags,
      searchTags
    );
  }

  public getPromisingFlats = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    let page = parseInt(req.query.page as string, 10) || 0;
    const searchProfileId = req.params.searchProfileId;
    const adFrequency = 3;
    try {
      const searchProfile =
        await SearchProfile.findById<ISearchProfile>(searchProfileId);
      checkMatchingAuth(searchProfile, req.body.userId);
      if (!this.matchingService) {
        return res.status(500).json({
          error: "Internal Server Error",
          message: "Matching Service not initialized",
        });
      }
      let promisingFlats: CommProfile[] = [];
      // Loop through suggestions until we find a flat that the user has not liked or disliked
      // This is avoided by using the page variable in the call to keep track of the number of suggestions shown
      while (promisingFlats.length === 0) {
        promisingFlats = this.matchingService.getBestFlats(
          searchProfileId,
          limit,
          page
        );
        if (promisingFlats.length === 0) {
          return res.status(204).json({ data: [], page: page });
        }
        page += 1;
        promisingFlats = promisingFlats.filter((promisingFlat) => {
          return (
            promisingFlat.reducedProfile!.status === "active" &&
            searchProfile!.priceRange.min <=
              promisingFlat.reducedProfile!.price! &&
            searchProfile!.priceRange.max >=
              promisingFlat.reducedProfile!.price! &&
            !searchProfile!.liked.find(
              (t) => t.toString() == promisingFlat.id
            ) &&
            !searchProfile!.disliked.find(
              (t) => t.toString() == promisingFlat.id
            )
          );
        });
      }
      // shuffling the results, so that the best ones are not always upfront, and it is worth it to go through all of them
      // even though the following shuffle is not perfectly random, it is good enough for our purposes
      // this will also ensure the first flat is always a very good match and triggers the user to go through the rest
      if (promisingFlats.length > 1) {
        const remainingFlats = promisingFlats
          .slice(1)
          .sort(() => Math.random() - 0.5);
        promisingFlats = [promisingFlats[0], ...remainingFlats];
      }

      const accountId = req.body.userId;
      const account = await AccountModel.findById(accountId);
      if (!account) {
        return res
          .status(404)
          .json({ error: "Not Found", message: "Account not found" });
      }
      if (!account.premiumUser) {
        const ads = await AdModel.aggregate([
          { $sample: { size: Math.ceil(promisingFlats.length / adFrequency) } },
        ]).exec();
        let adIndex = 0;
        for (
          let i = adFrequency - 1;
          i < promisingFlats.length && adIndex < ads.length;
          i += adFrequency
        ) {
          promisingFlats.splice(i, 0, {
            score: 0,
            id: ads[adIndex]._id.toString(),
            reducedProfile: null,
            isAd: true,
          });
          adIndex = (adIndex + 1) % ads.length;
        }
      }

      return res.status(200).json({ data: promisingFlats, page: page });
    } catch (error) {
      console.error(error);
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        return res.status(403).json({
          error: error.name,
          message: error.message,
        });
      } else if (
        error instanceof RequestError ||
        error instanceof NotFoundError
      ) {
        return res.status(400).json({
          error: error.name,
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to get promising flats",
      });
    }
  };

  public getPromisingTenants = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    let page = parseInt(req.query.page as string, 10) || 0;
    const flatProfileId = req.params.flatProfileId;
    try {
      const flatProfile =
        await FlatProfile.findById<IFlatProfile>(flatProfileId);
      checkMatchingAuth(flatProfile, req.body.userId);
      if (!this.matchingService) {
        return res.status(500).json({
          error: "Internal Server Error",
          message: "Matching Service not initialized",
        });
      }
      let promisingTenants: CommProfile[] = [];
      while (promisingTenants.length === 0) {
        promisingTenants = this.matchingService.getBestTenants(
          flatProfileId,
          limit,
          page
        );
        if (promisingTenants.length === 0) {
          // no more tenants to show
          return res.status(204).json({ data: promisingTenants, page: page });
        }
        page += 1;
        promisingTenants = promisingTenants.filter((searchProfile) => {
          return (
            (!searchProfile.reducedProfile!.status ||
              searchProfile.reducedProfile!.status === "active") &&
            !flatProfile?.disapproved.find(
              (t) => t.toString() === searchProfile.id
            ) &&
            !flatProfile?.approved.find(
              (t) => t.toString() === searchProfile.id
            ) &&
            flatProfile?.liked_by.find((t) => t.toString() === searchProfile.id)
          );
        });
      }
      return res.status(200).json({ data: promisingTenants, page: page });
    } catch (error) {
      console.error(error);
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        return res.status(403).json({
          error: error.name,
          message: error.message,
        });
      } else if (error instanceof RequestError) {
        return res.status(400).json({
          error: error.name,
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to get promising tenants",
      });
    }
  };

  public getApprovedTenants = async (req: Request, res: Response) => {
    const flatProfileId = req.params.flatProfileId;
    try {
      const flatProfile =
        await FlatProfile.findById<IFlatProfile>(flatProfileId);
      checkMatchingAuth(flatProfile, req.body.userId);
      return res.status(200).send(flatProfile!.approved);
    } catch (error) {
      console.error(error);
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        return res.status(403).json({
          error: error.name,
          message: error.message,
        });
      } else if (error instanceof RequestError) {
        return res.status(400).json({
          error: error.name,
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to get approved Tenants",
      });
    }
  };

  public likeFlat = async (req: Request, res: Response) => {
    if (
      !isValidObjectId(req.params.searchProfileId) ||
      !isValidObjectId(req.params.flatProfileId)
    ) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid searchProfileId or flatProfileId",
      });
    }
    try {
      const searchProfileId = new Types.ObjectId(req.params.searchProfileId);
      const flatProfileId = new Types.ObjectId(req.params.flatProfileId);
      const searchProfile =
        await SearchProfile.findById<ISearchProfile>(searchProfileId);
      checkMatchingAuth(searchProfile, req.body.userId);
      await FlatProfile.updateOne(
        { _id: flatProfileId },
        { $push: { liked_by: searchProfileId } }
      );
      await SearchProfile.updateOne(
        { _id: searchProfileId },
        { $push: { liked: flatProfileId } }
      );
      return res.status(200).json({
        message: "Flat liked successfully",
      });
    } catch (error) {
      console.error(error);
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        return res.status(403).json({
          error: error.name,
          message: error.message,
        });
      } else if (error instanceof RequestError) {
        return res.status(400).json({
          error: error.name,
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to like Tenant",
      });
    }
  };

  public dislikeFlat = async (req: Request, res: Response) => {
    if (
      !isValidObjectId(req.params.searchProfileId) ||
      !isValidObjectId(req.params.flatProfileId)
    ) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid searchProfileId or flatProfileId",
      });
    }
    try {
      const searchProfileId = new Types.ObjectId(req.params.searchProfileId);
      const flatProfileId = new Types.ObjectId(req.params.flatProfileId);
      const searchProfile =
        await SearchProfile.findById<ISearchProfile>(searchProfileId);
      checkMatchingAuth(searchProfile, req.body.userId);
      await SearchProfile.updateOne(
        { _id: searchProfileId },
        { $push: { disliked: flatProfileId } }
      );
      return res.status(200).json({
        message: "Flat disliked successfully",
      });
    } catch (error) {
      console.error(error);
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        return res.status(403).json({
          error: error.name,
          message: error.message,
        });
      } else if (error instanceof RequestError) {
        return res.status(400).json({
          error: error.name,
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to dislike Flat",
      });
    }
  };

  public approveTenant = async (req: Request, res: Response) => {
    const flatId = req.params.flatProfileId;
    const searchProfileId = req.params.searchProfileId;
    if (!isValidObjectId(flatId) || !isValidObjectId(searchProfileId)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid flatId or searchProfileId",
      });
    }
    try {
      const flatProfileObjectId = new Types.ObjectId(flatId);
      const searchProfileIdObjectId = new Types.ObjectId(searchProfileId);
      const profile =
        await FlatProfile.findById<IFlatProfile>(flatProfileObjectId);
      checkMatchingAuth(profile, req.body.userId);
      await FlatProfile.updateOne(
        { _id: flatProfileObjectId },
        { $push: { approved: searchProfileIdObjectId } }
      );
      return res.status(200).json({
        message: "Tenant approved successfully",
      });
    } catch (error) {
      console.error(error);
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        return res.status(403).json({
          error: error.name,
          message: error.message,
        });
      } else if (error instanceof RequestError) {
        return res.status(400).json({
          error: error.name,
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to approve Tenant",
      });
    }
  };

  public disapproveTenant = async (req: Request, res: Response) => {
    const flatId = req.params.flatProfileId;
    const searchProfileId = req.params.searchProfileId;
    if (!isValidObjectId(flatId) || !isValidObjectId(searchProfileId)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid flatId or searchProfileId",
      });
    }
    try {
      const flatProfileObjectId = new Types.ObjectId(flatId);
      const searchProfileIdObjectId = new Types.ObjectId(searchProfileId);
      const profile =
        await FlatProfile.findById<IFlatProfile>(flatProfileObjectId);
      checkMatchingAuth(profile, req.body.userId);
      await FlatProfile.updateOne(
        { _id: flatProfileObjectId },
        { $push: { disapproved: searchProfileIdObjectId } }
      );

      return res.status(200).json({
        message: "Tenant disapproved successfully",
      });
    } catch (error) {
      console.error(error);
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        return res.status(403).json({
          error: error.name,
          message: error.message,
        });
      } else if (error instanceof RequestError) {
        return res.status(400).json({
          error: error.name,
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to disapprove Tenant",
      });
    }
  };

  public async addProfile(req: Request, res: Response) {
    // Preferably use the on change listeners of mongoose to accordingly update the matching service (see init)
    const profile_type = req.params.profile_type;
    const profile_id = req.params.profile_id;
    if (!isValidObjectId(profile_id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid profile_id",
      });
    }
    if (
      profile_type == null ||
      !(profile_type in ["flatProfile", "searchProfile"])
    ) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid profile_type param",
      });
    }
    try {
      if (profile_type === "flatProfile") {
        const profile = await FlatProfile.findById<IFlatProfile>(profile_id);
        checkMatchingAuth(profile, req.body.userId);
        this.matchingService?.addOrUpdateFlatProfile(profile!);
      } else if (profile_type === "searchProfile") {
        const profile =
          await SearchProfile.findById<ISearchProfile>(profile_id);
        this.matchingService?.addOrUpdateSearchProfile(profile!);
      }
    } catch (error) {
      console.error(error);
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        return res.status(403).json({
          error: error.name,
          message: error.message,
        });
      } else if (error instanceof RequestError) {
        return res.status(400).json({
          error: error.name,
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to add profile",
      });
    }
  }
}

export default new MatchingController();
