import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { AdModel, IAd } from "../models/adModel";

export async function getAd(req: Request, res: Response): Promise<Response> {
  const { adId } = req.params;

  if (!isValidObjectId(adId)) {
    return res
      .status(400)
      .json({
        error: "Bad Request",
        message: "Invalid ad ID"
      });
  }

  try {
    const ad: IAd | null = await AdModel.findById(adId);

    if (!ad) {
      return res
        .status(404)
        .json({
          error: "Not Found",
          message: "Ad not found"
        })
    }

    return res
      .status(200)
      .json(ad)
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: "An error occurred while fetching the ad"
      })
  }
}
