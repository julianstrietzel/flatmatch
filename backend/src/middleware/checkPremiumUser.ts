import { NextFunction, Request, Response } from "express";
import { AccountModel } from "../models/accountModel";

const checkPremiumUser = async (req: Request, res: Response, next: NextFunction) => {
  const accountId = req.body.userId;

  try {
    const account = await AccountModel.findById(accountId);

    if (!account) {
      return res
        .status(404)
        .json({
          error: "Not Found",
          message: `Account with ID ${accountId} not found`,
        })
    }

    if (!account.premiumUser) {
      return res
        .status(401)
        .json({
          error: "Not Authorized",
          message: "Not authorized to perform this action",
        })
    }

    next()
  } catch (error) {
    console.error("Error while checking if user is premium:", error);
    return res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: "An error occurred while checking user permissions",
    });
  }
}

export default checkPremiumUser;
