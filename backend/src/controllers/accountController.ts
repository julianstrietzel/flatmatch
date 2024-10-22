import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import {
  AccountModel,
  IAccount,
  ILandlordAccount,
  ITenantAccount,
} from "../models/accountModel";
import cloudinary from "../config/cloudinaryConfig";
import { UploadApiResponse } from "cloudinary";
import { DocumentModel, IDocument } from "../models/documentModel";
import { FlatProfile, SearchProfile } from "../models/profileModel";

export async function getAccount(
  req: Request,
  res: Response
): Promise<Response> {
  const { accountId } = req.params;

  if (!isValidObjectId(accountId)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid account ID",
    });
  }

  try {
    let account = await AccountModel.findById(accountId).populate("documents");

    if (!account) {
      return res.status(404).json({
        error: "Not found",
        message: `Account with ID ${accountId} not found`,
      });
    }

    return res.status(200).json(account);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while updating the account",
    });
  }
}

export async function getLimitedAccount(
  req: Request,
  res: Response
): Promise<Response> {
  const { accountId } = req.params;

  if (!isValidObjectId(accountId)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid account ID",
    });
  }

  try {
    const account = await AccountModel.findById(accountId)
      .populate("documents")
      .select("documents emailConfirmed firstName lastName profilePicture");

    if (!account) {
      return res.status(404).json({
        error: "Not found",
        message: `Account with ID ${accountId} not found`,
      });
    }

    return res.status(200).json(account);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while retrieving the account",
    });
  }
}

export async function editAccount(
  req: Request,
  res: Response
): Promise<Response> {
  const { accountId } = req.params;

  if (!isValidObjectId(accountId)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid account ID",
    });
  }

  const { email, language, country, city, firstName, lastName, aboutMe } =
    req.body;
  const update: Partial<IAccount> = {
    email,
    language,
    country,
    city,
    firstName,
    lastName,
    aboutMe,
  };

  try {
    const account = await AccountModel.findByIdAndUpdate(accountId, update, {
      new: true,
      runValidators: true,
    });

    if (!account) {
      return res.status(404).json({
        error: "Not Found",
        message: `Account with ID ${accountId} not found`,
      });
    }

    return res.status(200).json(account);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while updating the account",
    });
  }
}

export const deleteAccount = async (req: Request, res: Response) => {
  const accountId = req.body.userId;

  if (!isValidObjectId(accountId)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Provided account ID is invalid",
    });
  }

  try {
    const account = await AccountModel.findById(accountId);

    if (!account) {
      return res.status(404).json({
        error: "Not Found",
        message: `Account with ID ${accountId} not found`,
      });
    }

    await DocumentModel.deleteMany({ _id: { $in: account.documents } });

    if (account.accountType === "landlord") {
      const landlordAccount = account as ILandlordAccount;

      await FlatProfile.deleteMany({ _id: { $in: landlordAccount.profiles } });
    }

    if (account.accountType === "tenant") {
      const tenantAccount = account as ITenantAccount;

      await SearchProfile.deleteOne({ _id: { $in: tenantAccount.profile } });
    }

    await AccountModel.deleteOne({ _id: accountId });

    return res.status(204).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while deleting the account",
    });
  }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
  const { accountId } = req.params;

  if (!isValidObjectId(accountId)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Provided account ID is invalid",
    });
  }

  try {
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({
        error: "Bad Request",
        message: "No profile picture uploaded",
      });
    }

    // Upload file to Cloudinary
    const uploadResult = await uploadFileToCloudinary(file);

    // Update profile picture in the account
    const imageUrl = uploadResult.secure_url;
    const updatedAccount = await updateProfilePicture(accountId, imageUrl);

    if (!updatedAccount) {
      return res.status(404).json({
        error: "Not Found",
        message: "Account not found",
      });
    }

    return res.status(200).json({ imageUrl : imageUrl });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while updating the profile picture",
    });
  }
};

export const uploadDocument = async (req: Request, res: Response) => {
  const { accountId } = req.params;
  const { documentType } = req.body;

  if (!isValidObjectId(accountId)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Provided account ID is invalid",
    });
  }

  try {
    const file = req.file as Express.Multer.File;

    const account = await AccountModel.findById(accountId).populate(
      "documents"
    );

    if (!account) {
      return res.status(404).json({
        error: "Not Found",
        message: "Account not found",
      });
    }

    const docs = account.documents as IDocument[];
    if (docs.some((doc) => doc.documentType === documentType)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Document type already satisfied",
      });
    }

    if (!file) {
      return res.status(400).json({
        error: "Bad Request",
        message: "No document uploaded",
      });
    }

    // Upload file to Cloudinary
    const uploadResult = await uploadFileToCloudinary(file);

    const documentURL = uploadResult.secure_url;
    const updatedAccount = await updateDocuments(
      accountId,
      documentType,
      documentURL
    );

    return res.status(200).json(updatedAccount!.documents);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while uploading the document",
    });
  }
};

export const deleteProfilePicture = async (req: Request, res: Response) => {
  const { accountId } = req.params;

  // Validate accountId
  if (!isValidObjectId(accountId)) {
    return res.status(400).json({
      error: "Invalid ID",
      message: "Provided account ID is invalid",
    });
  }

  const update = { profilePicture: "" };

  try {
    const account = await AccountModel.findByIdAndUpdate(accountId, update);

    if (!account) {
      return res.status(404).json({
        error: "Not Found",
        message: "Account not found",
      });
    }

    return res.status(200).json({
      message: "Profile picture deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while deleting the profile picture",
    });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  const { accountId, documentId } = req.params;

  // Validate accountId
  if (!isValidObjectId(accountId)) {
    return res.status(400).json({
      error: "Invalid ID",
      message: "Provided account ID is invalid",
    });
  }

  try {
    const document = await DocumentModel.findById(documentId);

    if (!document) {
      return res.status(404).json({
        error: "Not Found",
        message: "Document not found",
      });
    }

    const updatedAccount = await AccountModel.findByIdAndUpdate(
      accountId,
      { $pull: { documents: document._id } },
      { new: true }
    ).populate("documents");

    if (!updatedAccount) {
      return res.status(404).json({
        error: "Not Found",
        message: "Account not found",
      });
    }

    await DocumentModel.findByIdAndDelete(document._id);

    return res.status(200).json(updatedAccount.documents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while deleting the document",
    });
  }
};

const uploadFileToCloudinary = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const resourceType = file.mimetype === "application/pdf" ? "raw" : "auto";
    const fileExtension = file.originalname.split('.').pop();
    const publicId = file.originalname.split('.').slice(0, -1).join('.');

    const uploadOptions: any = {
      resource_type: resourceType,
    };

    if (resourceType === "raw") {
      uploadOptions.public_id = `${publicId}`;
      uploadOptions.format = fileExtension; // Ensuring the file extension is preserved for PDFs
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
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
};

const updateProfilePicture = async (accountId: string, imageUrl: string) => {
  const update: Partial<IAccount> = { profilePicture: imageUrl };
  return AccountModel.findByIdAndUpdate(accountId, update, {
    new: true,
    runValidators: true,
  });
};

const updateDocuments = async (
  accountId: string,
  documentType: string,
  documentURL: string
) => {
  const newDocument = new DocumentModel({ documentURL, documentType });
  const savedDocument = await newDocument.save();

  return AccountModel.findByIdAndUpdate(
    accountId,
    { $push: { documents: savedDocument._id } },
    { new: true, useFindAndModify: false }
  ).populate("documents");
};

export async function setPremiumUser(userId: string, type: string) {
  const currentDate = new Date();
  let premiumEndDate;

  if (type === "monthly") {
    premiumEndDate = new Date(currentDate);
    premiumEndDate.setMonth(currentDate.getMonth() + 1);
  } else if (type === "annually") {
    premiumEndDate = new Date(currentDate);
    premiumEndDate.setFullYear(currentDate.getFullYear() + 1);
  } else {
    throw new Error('Invalid type provided. Must be "monthly" or "annually".');
  }

  try {
    const result = await AccountModel.updateOne(
      { _id: userId },
      {
        $set: {
          premiumUser: true,
          premiumEndDate: premiumEndDate,
        },
      }
    );

    if (result.matchedCount > 0) {
      console.log(`User ${userId} upgraded to premium`);
    }
  } catch (error) {
    console.error(`Failed to update user ${userId}: ${error}`);
    throw error;
  }
}

export async function removePremiumUser(userId: unknown) {
  try {
    const result = await AccountModel.updateOne(
      { _id: userId },
      {
        $set: {
          premiumUser: false,
          premiumEndDate: null,
        },
      }
    );

    if (result.matchedCount > 0) {
      console.log(`User ${userId} downgraded to normal`);
    }
  } catch (error) {
    console.error(`Failed to update user ${userId}: ${error}`);
    throw error;
  }
}
