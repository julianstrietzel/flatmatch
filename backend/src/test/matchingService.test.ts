/* import { Types } from "mongoose";
import MatchingService from "../services/matchingService";
import { IFlatProfile, ISearchProfile } from "../models/profileModel";

describe("MatchingService", () => {
  let matchingService: MatchingService;

  const mockFlats = [
    {
      _id: new Types.ObjectId(),
      name: "Flat 1",
      account: new Types.ObjectId(1),
      description: "This is flat 1",
      tags: [
        {
          tagKey: "flattag1",
        },
        {
          tagKey: "flattag10",
        },
      ],
      requirements: [
        {
          reqKey: "tag1",
          weight: 10,
        },
        {
          reqKey: "tag10",
          weight: 10,
        },
      ],
      address: new Types.ObjectId(1),
      price: 1000,
      size: 100,
      type: "apartment",
      images: ["image1.jpg", "image2.jpg"],
      approved: [new Types.ObjectId(1)],
      liked_by: [new Types.ObjectId(2), new Types.ObjectId(3)],
      disapproved: [new Types.ObjectId(2), new Types.ObjectId(3)],
    },
    {
      _id: new Types.ObjectId(),
      name: "Flat 2",
      account: new Types.ObjectId(1),
      description: "This is flat 1",
      tags: [
        {
          tagKey: "flattag3",
        },
        {
          tagKey: "flattag4",
        },
      ],
      requirements: [
        {
          reqKey: "tag3",
          weight: 1,
        },
        {
          reqKey: "tag4",
          weight: 2,
        },
      ],
      address: new Types.ObjectId(3),
      price: 1000,
      size: 100,
      type: "apartment",
      images: ["image1.jpg", "image2.jpg"],
      approved: [new Types.ObjectId(1)],
      liked_by: [new Types.ObjectId(2), new Types.ObjectId(3)],
      disapproved: [new Types.ObjectId(2), new Types.ObjectId(3)],
    },
    {
      _id: new Types.ObjectId(),
      name: "Flat 3",
      account: new Types.ObjectId(1),
      description: "This is flat 1",
      tags: [
        {
          tagKey: "flattag3",
        },
        {
          tagKey: "flattag4",
        },
      ],
      requirements: [
        {
          reqKey: "tag3",
          weight: 3,
        },
        {
          reqKey: "tag4",
          weight: 2,
        },
      ],
      address: new Types.ObjectId(2),
      price: 1000,
      size: 100,
      type: "apartment",
      images: ["image1.jpg", "image2.jpg"],
      approved: [new Types.ObjectId(1)],
      liked_by: [new Types.ObjectId(2), new Types.ObjectId(3)],
      disapproved: [new Types.ObjectId(2), new Types.ObjectId(3)],
    },
  ];

  const mockSearchProfiles = [
    {
      _id: new Types.ObjectId(),
      name: "Search 1",
      account: new Types.ObjectId(1),
      description: "This is search 1",
      tags: [
        {
          tagKey: "tag1",
        },
      ],
      requirements: [
        {
          reqKey: "flattag1",
          weight: 1,
        },
      ],
      liked: [],
      disliked: [],
      images: ["image1.jpg", "image2.jpg"],
    },
    {
      _id: new Types.ObjectId(),
      name: "Search 2",
      account: new Types.ObjectId(2),
      description: "This is search 2",
      tags: [
        {
          tagKey: "tag3",
        },
        {
          tagKey: "tag4",
        },
      ],
      requirements: [
        {
          reqKey: "flattag3",
          weight: 1,
        },
        {
          reqKey: "flattag4",
          weight: 2,
        },
      ],
      images: ["image1.jpg", "image2.jpg"],
      liked: [],
      disliked: [],
    },
    {
      _id: new Types.ObjectId(),
      name: "Search 3",
      account: new Types.ObjectId(3),
      description: "This is search 3",
      tags: [
        {
          tagKey: "tag3",
        },
        {
          tagKey: "tag4",
        },
      ],
      requirements: [],
      liked: [],
      images: ["image1.jpg", "image2.jpg"],
      disliked: [],
    },
    {
      _id: new Types.ObjectId(),
      name: "Search 3",
      account: new Types.ObjectId(3),
      description: "This is search 3",
      tags: [
        {
          tagKey: "tag3",
        },
        {
          tagKey: "tag4",
        },
      ],
      requirements: [],
      liked: [],
      images: ["image1.jpg", "image2.jpg"],
      disliked: [],
    },
    {
      _id: new Types.ObjectId(),
      name: "Search 3",
      account: new Types.ObjectId(3),
      description: "This is search 3",
      tags: [
        {
          tagKey: "tag2",
        },
        {
          tagKey: "tag4",
        },
      ],
      requirements: [],
      liked: [],
      images: ["image1.jpg", "image2.jpg"],
      disliked: [],
    },
  ];

  const flatTags = [
    "flattag1",
    "flattag2",
    "flattag3",
    "flattag4",
    "flattag10",
  ];

  const searchTags = [
    "tag1",
    "tag2",
    "tag3",
    "tag4",
    "tag5",
    "tag6",
    "tag7",
    "tag10",
  ];

  beforeEach(() => {
    matchingService = new MatchingService(
      mockFlats,
      mockSearchProfiles,
      flatTags,
      searchTags,
      0.3
    );
  });

  it("should initialize with predefined profiles", () => {
    expect(
      matchingService.getBestFlats(mockSearchProfiles[0]._id, 10)!.length
    ).toBeGreaterThan(0);
    expect(
      matchingService.getBestFlats(mockSearchProfiles[0]._id, 10)![0].id
    ).toEqual(mockFlats[0]._id.toString());
    expect(
      matchingService.getBestTenants(mockFlats[0]._id, 10)!.length
    ).toBeGreaterThan(0);
    expect(matchingService.getBestTenants(mockFlats[0]._id, 10)![0].id).toEqual(
      mockSearchProfiles[0]._id.toString()
    );
  });

  it("should add a new flat profile and update rankings", () => {
    const newFlat: IFlatProfile = {
      _id: new Types.ObjectId(),
      name: "Flat 4",
      account: new Types.ObjectId(2),
      description: "This is flat 4",
      tags: [
        {
          tagKey: "flattag1",
        },
        {
          tagKey: "flattag2",
        },
      ],
      requirements: [{ reqKey: "tag2", weight: 300 }],
      address: new Types.ObjectId(3),
      price: 2000,
      size: 150,
      type: "house",
      images: ["image3.jpg", "image4.jpg"],
      approved: [],
      liked_by: [new Types.ObjectId(2), new Types.ObjectId(3)],
      disapproved: [],
    };

    matchingService.addOrUpdateFlatProfile(newFlat);
    const best_tenants = matchingService.getBestTenants(newFlat._id!, 10)!;
    expect(matchingService.getBestTenants(newFlat._id!, 10)![0].id).toBe(
      mockSearchProfiles[4]._id.toString()
    );
    expect(
      matchingService.getBestFlats(mockSearchProfiles[4]._id, 10)![0].id
    ).toBe(newFlat._id!.toString());
  });

  it("should add a new search profile and update rankings", () => {
    const newSearch: ISearchProfile = {
      _id: new Types.ObjectId(),
      name: "Search 4",
      account: new Types.ObjectId(),
      description: "This is search 4",
      tags: [{ tagKey: "tag10" }],
      requirements: [{ reqKey: "flattag10", weight: 500 }],
      liked: [],
      disliked: [],
      images: ["image5.jpg", "image6.jpg"],
    };

    matchingService.addOrUpdateSearchProfile(newSearch);
    const bestFlats = matchingService.getBestFlats(newSearch._id!, 10)!;
    expect(matchingService.getBestFlats(newSearch._id!, 10)![0].id).toBe(
      mockFlats[0]._id.toString()
    );
    const bestTenants = matchingService.getBestTenants(mockFlats[0]._id, 10)!;
    expect(matchingService.getBestTenants(mockFlats[0]._id, 10)![0].id).toBe(
      newSearch._id!.toString()
    );
  });

  it("should update an existing flat profile and adjust rankings", () => {
    const updatedFlat: IFlatProfile = {
      _id: mockFlats[0]._id,
      name: "Updated Flat 1",
      account: new Types.ObjectId(1),
      description: "This is an updated flat 1",
      tags: [],
      requirements: [
        { reqKey: "tag2", weight: 5 },
        {
          reqKey: "tag4",
          weight: 10,
        },
      ],
      address: new Types.ObjectId(1),
      price: 1100,
      size: 110,
      type: "apartment",
      images: ["image1.jpg", "image2.jpg"],
      approved: [new Types.ObjectId(1)],
      liked_by: [new Types.ObjectId(2), new Types.ObjectId(3)],
      disapproved: [new Types.ObjectId(1)],
    };

    matchingService.addOrUpdateFlatProfile(updatedFlat);
    const bestFlats = matchingService.getBestFlats(
      mockSearchProfiles[mockSearchProfiles.length - 1]._id,
      10
    )!;
    expect(bestFlats[0].id).toBe(updatedFlat._id!.toString());
    expect(bestFlats[0].score).toBeGreaterThan(0);
  });

  it("should update an existing search profile and adjust rankings", () => {
    const updatedSearch: ISearchProfile = {
      _id: mockSearchProfiles[0]._id,
      name: "Updated Search 1",
      account: new Types.ObjectId(1),
      description: "This is an updated search 1",
      tags: [{ tagKey: "tag2" }],
      requirements: [{ reqKey: "flattag2", weight: 5 }],
      liked: [],
      disliked: [],
      images: ["image1.jpg", "image2.jpg"],
    };

    const bestTenants = matchingService.getBestTenants(mockFlats[0]._id, 10)!;
    expect(bestTenants[0].id).toBe(updatedSearch._id!.toString());
    matchingService.addOrUpdateSearchProfile(updatedSearch);
    matchingService.addOrUpdateSearchProfile({
      _id: mockSearchProfiles[mockSearchProfiles.length - 1]!._id,
      name: "Search 5",
      account: new Types.ObjectId(3),
      description: "This is search 5",
      tags: [{ tagKey: "tag1" }],
      requirements: [{ reqKey: "flattag1", weight: 5 }],
      liked: [],
      disliked: [],
      images: ["image1.jpg", "image2.jpg"],
    });
    const bestTenantsUpdated = matchingService.getBestTenants(
      mockFlats[0]._id,
      10
    )!;
    expect(bestTenantsUpdated[0].id).toBe(
      mockSearchProfiles[mockSearchProfiles.length - 1]!._id!.toString()
    );
    expect(bestTenantsUpdated[0].score).toBeGreaterThan(0);
  });
});

*/
