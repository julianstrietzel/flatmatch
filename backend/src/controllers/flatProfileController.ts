import { Request, Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import cloudinary from "../config/cloudinaryConfig";
import { UploadApiResponse } from "cloudinary";
import {
  FlatProfile,
  IFlatProfile,
  SearchProfile,
} from "../models/profileModel";
import { addressModel } from "../models/addressModel";
import axios from "axios";
import { LandlordAccountModel } from "../models/accountModel";

// Create a new flat profile
export const createFlatProfile = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      additionalCosts,
      numberOfRooms,
      totalCosts,
      tags,
      requirements,
      address,
      price,
      size,
      type,
      images,
    } = req.body;

    const account = req.body.userId; // Extract userId from request body

    if (!isValidObjectId(account)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid landlord id",
      });
    }

    const addressData = new addressModel({
      street: address.street,
      buildingNumber: address.buildingNumber,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      latitude: address.latitude || null,
      longitude: address.longitude || null,
    });

    const savedAddress = await addressData.save();

    // Then create the flat profile with the reference to the address
    const flatProfile = new FlatProfile({
      account: new mongoose.Types.ObjectId(account),
      name,
      description,
      tags,
      additionalCosts,
      numberOfRooms,
      totalCosts,
      requirements,
      address: savedAddress._id, // Reference the saved address here
      price,
      size,
      type,
      images,
    });
    await flatProfile.save();
    await LandlordAccountModel.findByIdAndUpdate(account, {
      $push: { profiles: flatProfile._id },
    });
    res.status(201).json(flatProfile);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const uploadImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map((file) => {
      return new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) {
              return reject(new Error("Upload to Cloudinary failed"));
            }
            if (result) {
              resolve(result);
            } else {
              reject(new Error("Upload result is undefined"));
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    res.status(201).json({ images: imageUrls });
  } catch (error) {
    res.status(500).json({
      error: "Server Error",
      message: "Failed to upload images",
    });
  }
};

export const getAddress = async (req: Request, res: Response) => {
  const { q } = req.query;
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address suggestions" });
  }
};

export const getFlatProfile = async (req: Request, res: Response) => {
  const flatProfileId = req.params.flatProfileId;
  const flatProfile =
    await FlatProfile.findById<IFlatProfile>(flatProfileId).populate("address");
  if (!flatProfile) {
    return res.status(404).json({
      error: "Not Found",
      message: "Flat Profile not found",
    });
  }
  return res.status(200).send(flatProfile);
};

export const editFlatProfile = async (req: Request, res: Response) => {
  const updates = req.body;
  const options = { new: true };
  const flatProfileId = req.params.flatProfileId;

  try {
    const updatedProfile = await FlatProfile.findByIdAndUpdate(
      flatProfileId,
      updates,
      options
    );
    if (!updatedProfile) {
      return res.status(404).send({ message: "Flat profile not found" });
    }
    res.status(200).send(updatedProfile);
  } catch (error) {
    res.status(400).send(error);
  }
};
