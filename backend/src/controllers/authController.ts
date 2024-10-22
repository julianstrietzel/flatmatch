import { Request, Response } from "express";
import {
  createAccount,
  authenticateAccount,
  reAuthenticateAccount,
  changeAccountPassword,
} from "../services/authService";
import bcrypt from "bcryptjs";
import { AccountModel } from "../models/accountModel";

export const signup = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, accountType } = req.body;

  try {
    await createAccount(email, password, firstName, lastName, accountType);
    const { token, user } = await authenticateAccount(email, password);
    res.status(201).json({ token, user });
  } catch (error: any) {
    console.error("Signup error:", error);
    if (error.message === "Invalid account type") {
      res.status(400).json({ message: "Invalid account type" });
    } else if (error.code === 11000) {
      res.status(409).json({ message: "Email already in use" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await authenticateAccount(email, password);
    res.status(200).json({ token, user });
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.message === "Invalid email or password") {
      res.status(400).json({ message: "Invalid email or password" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const confirmEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decodedToken = decodeURIComponent(token);
    const account = await AccountModel.findOne({
      emailConfirmationToken: decodedToken,
    });

    if (!account) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    account.emailConfirmed = true;
    account.emailConfirmationToken = undefined; // We need ot invalidate the token
    await account.save();

    res.status(200).json({ message: "Email confirmed successfully" });
  } catch (error) {
    console.error("Error confirming email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const accountId = req.body.userId;

  try {
    await changeAccountPassword(accountId, oldPassword, newPassword);
    res
      .status(200)
      .json({ message: "Password changed successfully. Logging out..." });
  } catch (error: any) {
    console.error("Change password error: ", error);
    if (error.message === "Account not found") {
      res.status(404).json({ message: "Account not found" });
    } else if (error.message === "New password cannot be the same") {
      res.status(400).json({ message: "New password cannot be the same" });
    } else if (error.message === "Old password does not match") {
      res.status(400).json({ message: "Failed to update password" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const reAuth = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const { token, user } = await reAuthenticateAccount(userId);
    res.status(200).json({ token, user });
  } catch (error: any) {
    console.error("Re-Authentication error:", error);
    res.status(404).json({ message: "Account not found" });
  }
};
