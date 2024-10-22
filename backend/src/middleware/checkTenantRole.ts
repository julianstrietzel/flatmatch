import { NextFunction, Request, Response } from "express";
import { AccountModel } from "../models/accountModel";

const checkTenantRole = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId;

  try {
    const user = await AccountModel.findById(userId);
    console.log(user)
    if (!user) {
      return res
        .status(401)
        .json({
          error: "Unauthorized",
          message: " An error occurred by authorization"
        });
    }

    if (user.accountType !== "tenant") {
      return res
        .status(401)
        .json({
          error: "Unauthorized",
          message: "An error occurred by authorization"
        });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: "An error occurred while checking user role",
    });
  }
};

export default checkTenantRole;

