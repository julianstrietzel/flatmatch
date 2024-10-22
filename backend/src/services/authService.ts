import {
  AccountModel,
  IAccount,
  ILandlordAccount,
  isTenantAccount,
  ITenantAccount,
} from "../models/accountModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { removePremiumUser } from "../controllers/accountController";
import { isAfterCurrentDate } from "../utils/dateUtil";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

dotenv.config();

// Configure the email transporter of nodemailer
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async (
  user: Document<unknown, {}, IAccount> & IAccount & Required<{ _id: unknown }>
) => {
  const token = randomUUID();

  user.emailConfirmationToken = token;
  await user.save();

  const confirmationUrl = `${
    process.env.FRONTEND_URL
  }/confirm-email/${encodeURIComponent(token)}`;

  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "src",
    "templates",
    "confirmationEmailTemplate.html"
  );
  let emailTemplate = fs.readFileSync(templatePath, "utf8");

  emailTemplate = emailTemplate.replace(/{{firstName}}/g, user.firstName);
  emailTemplate = emailTemplate.replace(
    /{{confirmationUrl}}/g,
    confirmationUrl
  );
  emailTemplate = emailTemplate.replace(
    /{{year}}/g,
    new Date().getFullYear().toString()
  );

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email.toLowerCase(),
    subject: "Email Confirmation",
    html: emailTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const createAccount = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  accountType: string
) => {
  const normalizedEmail = email.toLowerCase();

  let account;
  if (accountType === "tenant") {
    account = new AccountModel({
      email: normalizedEmail,
      password,
      firstName,
      lastName,
      accountType,
      __t: "TenantAccount",
    });
  } else if (accountType === "landlord") {
    account = new AccountModel({
      email: normalizedEmail,
      password,
      firstName,
      lastName,
      accountType,
      __t: "LandlordAccount",
    });
  } else {
    throw new Error("Invalid account type");
  }

  await account.save();
  await sendConfirmationEmail(account);
  return account;
};

export const authenticateAccount = async (email: string, password: string) => {
  const normalizedEmail = email.toLowerCase();

  const account = await AccountModel.findOne({ email: normalizedEmail });
  if (!account) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, account.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: account._id, accountType: account.accountType },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  // Check if FlatMatch Plus has expired
  if (account.premiumUser && account.premiumEndDate) {
    if (isAfterCurrentDate(account.premiumEndDate)) {
      await removePremiumUser(account._id);
      account.premiumUser = false;
      account.premiumEndDate = null;
    }
  }

  if (isTenantAccount(account)) {
    const tenantAccount = account as ITenantAccount;
    return {
      token,
      user: {
        id: tenantAccount._id,
        email: tenantAccount.email,
        firstName: tenantAccount.firstName,
        lastName: tenantAccount.lastName,
        accountType: tenantAccount.accountType,
        premiumUser: tenantAccount.premiumUser,
        profile: tenantAccount.profile,
        profilePicture: tenantAccount.profilePicture,
        premiumEndDate: tenantAccount.premiumEndDate,
        aboutMe: tenantAccount.aboutMe,
      },
    };
  } else {
    const landlordAccount = account as ILandlordAccount;
    return {
      token,
      user: {
        id: landlordAccount._id,
        email: landlordAccount.email,
        firstName: landlordAccount.firstName,
        lastName: landlordAccount.lastName,
        accountType: landlordAccount.accountType,
        premiumUser: landlordAccount.premiumUser,
        premiumEndDate: landlordAccount.premiumEndDate,
        profiles: landlordAccount.profiles,
        profilePicture: landlordAccount.profilePicture,
        aboutMe: landlordAccount.aboutMe,
      },
    };
  }
};

export const reAuthenticateAccount = async (accountId: mongoose.ObjectId) => {
  const account = await AccountModel.findOne({ _id: accountId });

  if (!account) {
    throw new Error("Account not found");
  }

  const token = jwt.sign(
    { id: account._id, accountType: account.accountType },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  if (isTenantAccount(account)) {
    const tenantAccount = account as ITenantAccount;
    return {
      token,
      user: {
        id: tenantAccount._id,
        email: tenantAccount.email,
        firstName: tenantAccount.firstName,
        lastName: tenantAccount.lastName,
        accountType: tenantAccount.accountType,
        premiumUser: tenantAccount.premiumUser,
        premiumEndDate: tenantAccount.premiumEndDate,
        profile: tenantAccount.profile,
        profilePicture: tenantAccount.profilePicture,
        aboutMe: tenantAccount.aboutMe,
      },
    };
  } else {
    const landlordAccount = account as ILandlordAccount;
    return {
      token,
      id: landlordAccount._id,
      email: landlordAccount.email,
      firstName: landlordAccount.firstName,
      lastName: landlordAccount.lastName,
      accountType: landlordAccount.accountType,
      premiumUser: landlordAccount.premiumUser,
      premiumEndDate: landlordAccount.premiumEndDate,
      profiles: landlordAccount.profiles,
      profilePicture: landlordAccount.profilePicture,
      aboutMe: landlordAccount.aboutMe,
    };
  }
};

export const changeAccountPassword = async (
  accountId: string,
  oldPassword: string,
  newPassword: string
) => {
  const account = await AccountModel.findById(accountId);

  if (!account) {
    throw new Error("Account not found");
  }

  const isMatch = await account.comparePassword(oldPassword);

  if (!isMatch) {
    throw new Error("Old password does not match");
  }

  const isSame = await bcrypt.compare(oldPassword, newPassword);

  if (isSame) {
    throw new Error("Old password cannot be the same");
  }

  account.password = newPassword;
  await account.save();
};
