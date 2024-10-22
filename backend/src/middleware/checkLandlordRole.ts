import { NextFunction, Request, Response } from "express";
import { AccountModel } from "../models/accountModel";

const checkLandlordRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("test");
  const userId = req.body.userId;

  try {
    const user = await AccountModel.findById(userId);
    console.log(user);
    if (!user) {
      console.log("User not found");
      return res.status(401).send({
        error: "Unauthorized",
        message: " An error occurred by authorization",
      });
    }

    if (user.accountType !== "landlord") {
      console.log("User is not a landlord");
      return res.status(401).send({
        error: "Uauthorized",
        message: "An error occurred by authorization",
      });
    }

    next();
  } catch (error) {
    console.error("Error while checking user role:", error);
    res.status(500).send({
      error: "Internal Server Error",
      message: "An error occurred while checking user role",
    });
  }
};

export default checkLandlordRole;
