import { Request, Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { ISearchProfile, SearchProfile } from "../models/profileModel";
import { TenantAccountModel } from "../models/accountModel";

// Create a new flat profile
export const createSearchProfile = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);

    const {
      numberOfRooms,
      description,
      size,
      type,
      tags,
      requirements,
      priceRange,
      city,
      country,
    } = req.body;

    const account = req.body.userId; // Extract userId from request body

    if (!isValidObjectId(account)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid account id",
      });
    }

    // Create the search profile
    const searchProfile = new SearchProfile({
      account: new mongoose.Types.ObjectId(account),
      description,
      numberOfRooms,
      size,
      type,
      tags,
      requirements,
      priceRange,
      city,
      country,
    });

    await searchProfile.save();
    await TenantAccountModel.findByIdAndUpdate(account, {
      profile: searchProfile._id,
    });

    res.status(201).json(searchProfile);
  } catch (error) {
    res.status(500).send(error);
  }
};

export async function editSearchProfile(req: Request, res: Response) {
  try {
    const searchProfileId = req.params.searchProfileId;
    const account = req.body.userId; // Extract userId from request body

    if (!isValidObjectId(account)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid account id",
      });
    }
    const searchProfile =
      await SearchProfile.findById<ISearchProfile>(searchProfileId);
    if (!searchProfile) {
      return res.status(404).json({
        error: "Not Found",
        message: "Search profile not found",
      });
    }
    if (searchProfile.account.toString() !== account) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You are not authorized to edit this search profile",
      });
    }
    if (req.body.status) {
      searchProfile.status = req.body.status;
      await searchProfile.save();
      return res.status(200).send(searchProfile);
    }
    const {
      numberOfRooms,
      description,
      size,
      type,
      tags,
      requirements,
      priceRange,
      city,
      country,
    } = req.body;

    searchProfile.numberOfRooms = numberOfRooms;
    searchProfile.description = description;
    searchProfile.size = size;
    searchProfile.type = type;
    searchProfile.tags = tags;
    searchProfile.requirements = requirements;
    searchProfile.priceRange = priceRange;
    searchProfile.city = city;
    searchProfile.country = country;
    // save new search profile under the previous id
    await searchProfile.save();

    await res.status(200).send(searchProfile);
  } catch (error) {
    res.status(400).send(error);
  }
}

export async function getSearchProfile(req: Request, res: Response) {
  const userId = req.body.userId;
  let filter;
  const searchProfileId = req.params.searchProfileId;
  if (searchProfileId) {
    filter = { _id: searchProfileId };
  } else {
    filter = { account: userId };
  }
  try {
    const searchProfiles = await SearchProfile.find(filter);
    res.status(200).send(searchProfiles);
  } catch (error) {
    res.status(400).send(error);
  }
}
