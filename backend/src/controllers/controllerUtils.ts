import { Request } from "express";
import { Document, Types } from "mongoose";
import { IChat } from "../models/chatModel";
import {
  FlatProfile,
  IFlatProfile,
  ISearchProfile,
  SearchProfile,
} from "../models/profileModel";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RequestError,
} from "../errors";

export function verifyRequestHasBody(req: Request, keys: string[]): boolean {
  /**
   * Verify that the request has a body with the required keys
   * @param req - The request object
   * @param keys - The required keys
   */
  if (!req.body) {
    return true;
  }
  for (const key of keys) {
    if (!req.body[key]) {
      return false;
    }
  }
  return true;
}

export async function checkChatAuthentication(
  chat: Document<unknown, IChat> & IChat & Required<{ _id: unknown }>,
  userId: string | undefined = undefined,
  role: string | null = null
) {
  /**
   * Check if the user is authorized to send a message in the chat
   * @param chat - The chat to check
   * @param userId - The user's ID
   * @param role - The user's role
   * @param skipAuth - Skip the authentication check for development purposes
   */
  if (!userId) {
    throw new AuthenticationError("User not authenticated");
  }
  if (role?.toLowerCase() === "landlord") {
    const flatProfile = await FlatProfile.findById(chat?.flatProfile);
    if (!flatProfile) {
      throw new Error("FlatProfile matching chat not found");
    }
    if (flatProfile.account!.toString() !== userId) {
      throw new AuthorizationError("User not authorized to send message");
    }
  } else if (role?.toLowerCase() === "tenant") {
    const searchProfile = await SearchProfile.findById(chat?.searchProfile);
    if (!searchProfile) {
      throw new Error("SearchProfile matching chat not found");
    }
    if (searchProfile.account!.toString() !== userId) {
      throw new AuthorizationError("User not authorized to send message");
    }
  } else if (role === null) {
    const flatProfile = await FlatProfile.findById(chat?.flatProfile);
    const searchProfile = await SearchProfile.findById(chat?.searchProfile);
    if (!flatProfile || !searchProfile) {
      throw new Error("FlatProfile or SearchProfile matching chat not found");
    }
    if (
      flatProfile.account!.toString() !== userId &&
      searchProfile.account!.toString() !== userId
    ) {
      throw new AuthorizationError("User not authorized to access chat");
    }
  } else {
    throw new RequestError("Invalid sender, must be landlord or tenant");
  }
}

export async function createFilterForChatsOfUser(
  userId: string | Types.ObjectId,
  userType: string
) {
  /**
   * Create a filter for chats of a user
   * @param userId - The user's ID
   * @param userType - The user's role (Landlord or Tenant)
   */
  // chats are associated to profiles that belong to a user_id
  // provided a user id I need to get the profiles and then filter for the chats depending on the user type
  const newUserId: Types.ObjectId = !(userId instanceof Types.ObjectId)
    ? new Types.ObjectId(userId)
    : userId;

  let filter;
  if (userType.toLowerCase() == "landlord") {
    const flatProfiles = await FlatProfile.find({
      account: newUserId,
    });
    const flatProfileIds = flatProfiles.map((profile) => profile._id!);
    filter = { flatProfile: { $in: flatProfileIds } };
  } else if (userType.toLowerCase() == "tenant") {
    const searchProfile = await SearchProfile.findOne({
      account: newUserId,
    });
    if (!searchProfile) {
      filter = { searchProfile: new Types.ObjectId(0) };
    } else {
      filter = { searchProfile: searchProfile._id };
    }
  } else {
    throw new RequestError("Invalid user_type");
  }
  return filter;
}

export function checkMatchingAuth(
  profile: IFlatProfile | ISearchProfile | null,
  userId: string
) {
  if (!profile) {
    throw new NotFoundError("Flat Profile for adding to matching not found");
  }
  if (profile.account == null) {
    throw new RequestError("Flat Profile does not have an account");
  }
  if (profile.account.toString() !== userId) {
    throw new AuthorizationError("Flat Profile does not belong to user");
  }
}
