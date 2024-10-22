import { Request, Response } from "express";
import { Document, isValidObjectId } from "mongoose";

import {
  checkChatAuthentication,
  createFilterForChatsOfUser,
  verifyRequestHasBody,
} from "./controllerUtils";
import { Chat, ChatMessage } from "../models/chatModel";

import { io } from "../index";
import { FlatProfile, SearchProfile } from "../models/profileModel";
import {
  AuthenticationError,
  AuthorizationError,
  RequestError,
} from "../errors";
import { AccountModel } from "../models/accountModel";

export async function getChat(req: Request, res: Response): Promise<Response> {
  /**
     Get a specific chat by id
     GET /chats/:chat_id
     */
  const chat_id = req.params.chat_id;
  const userID = req.body.userId;

  if (!isValidObjectId(chat_id)) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid chat_id" });
  }
  try {
    const chat = await Chat.findById(chat_id);
    if (!chat) {
      return res.status(404).json({
        error: "Not Found",
        message: `Chat with id ${chat_id} not found`,
      });
    }
    await checkChatAuthentication(chat, userID, null);
    return res.status(200).send(chat);
  } catch (error) {
    console.error(error);
    if (error instanceof AuthenticationError) {
      return res.status(403).json({
        error: error.name,
        message: error.message,
      });
    }
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while fetching the chat",
    });
  }
}

export async function getChatsByUserId(
  req: Request,
  res: Response
): Promise<Response> {
  /**
     Get all chats for specific user by user id and user type
     GET /chats/:user_type/
     */
  const userId = req.body.userId;
  const userType = req.params.user_type;
  // check valid user_id
  if (!isValidObjectId(userId)) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid user_id" });
  }

  try {
    const filter = await createFilterForChatsOfUser(userId, userType);
    const chats = (await Chat.find(filter)) || [];
    return res.status(200).send(chats);
  } catch (error) {
    console.error(error);
    if (error instanceof RequestError) {
      return res.status(400).json({
        error: error.name,
        message: error.message,
      });
    }
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while fetching the chat",
    });
  }
}

export async function postChat(req: Request, res: Response): Promise<Response> {
  /**
     Create a new chat
     POST /chats
     {
     flatProfile: string,
     searchProfile: string
     }
     */
  const userID = req.body.userId;
  if (!verifyRequestHasBody(req, ["flatProfile", "searchProfile"])) {
    return res.status(400).json({ message: "Missing profile references" });
  }
  if (
    !isValidObjectId(req.body.flatProfile) ||
    !isValidObjectId(req.body.searchProfile)
  ) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid flatProfile or searchProfile id",
    });
  }
  try {
    if ("Tenant" in req.body) {
      return res.status(400).json({
        error: "Bad Request",
        message:
          "Using deprecated version of api. Please provide search and flat profiles.",
      });
    }
    const flatProfile = await FlatProfile.findById(req.body.flatProfile);
    if (!flatProfile) {
      return res.status(404).json({
        error: "Not Found",
        message: "FlatProfile not found",
      });
    }
    const searchProfile = await SearchProfile.findById(req.body.searchProfile);
    if (!searchProfile) {
      return res.status(404).json({
        error: "Not Found",
        message: "SearchProfile not found",
      });
    }
    if (
      flatProfile.account!.toString() !== userID &&
      searchProfile.account!.toString() !== userID
    ) {
      return res.status(403).json({
        error: "Forbidden",
        message: "User not authorized to create chat",
      });
    }

    const newChat = new Chat({
      messages: [],
      flatProfile: req.body.flatProfile,
      searchProfile: req.body.searchProfile,
    });
    // Save the new Chat document to the database
    const result: Document = await newChat.save();
    io.to(`user-${userID}`).emit("chatCreated", result);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: "Chat not saved" });
  }
}

export async function postMessage(
  req: Request,
  res: Response
): Promise<Response> {
  /**
     Add a message to a chat
     POST /chats/:chat_id
     {
     content: string,
     sender: string (Landlord or Tenant)
     }
     */
  if (!verifyRequestHasBody(req, ["content", "sender"])) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Missing content or sender_id",
    });
  }
  const chat_id = req.params.chat_id;
  const content = req.body.content;
  const sender = req.body.sender.toLowerCase();
  const documentURL = req.body.documentURL;

  if (typeof content !== "string" || !isValidObjectId(chat_id)) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid body" });
  }

  try {
    const chat = await Chat.findById(chat_id);
    if (!chat) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Chat not found" });
    }
    await checkChatAuthentication(chat, req.body.userId, sender);
    if (chat.status === "inactive") {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Chat is not active" });
    } else if (chat.status === "new") {
      chat.status = "active";
    }

    let message;

    if (documentURL) {
      message = new ChatMessage({
        content: content,
        sender: sender,
        timestamp: new Date(),
        unread: true,
        documentURL: documentURL,
      });
    } else {
      message = new ChatMessage({
        content: content,
        sender: sender,
        timestamp: new Date(),
        unread: true,
      });
    }

    chat.messages.push(message);
    const newChat = await chat.save();
    const [idToFetch, dataClass] =
      sender.toLowerCase() === "landlord"
        ? [chat.searchProfile, SearchProfile]
        : [chat.flatProfile, FlatProfile];
    dataClass.findById(idToFetch).then((profile) => {
      if (profile) {
        io.to(`user-${profile.account}`).emit("chatUpdated", newChat);
      }
    });
    return res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    if (
      error instanceof AuthenticationError ||
      error instanceof AuthorizationError
    ) {
      return res.status(403).json({
        error: error.name,
        message: error.message,
      });
    } else if (error instanceof RequestError) {
      return res.status(400).json({
        error: error.name,
        message: error.message,
      });
    }
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: "Message not saved" });
  }
}

export async function postMessagesofUserRead(req: Request, res: Response) {
  /**
   * Mark all messages of a user within a chat as read
   * POST /chats/:chat_id/:user_type/read
   */

  const chatId = req.params.chat_id;
  const userType = req.params.user_type.toLowerCase();
  if (!isValidObjectId(chatId)) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid chat_id" });
  }
  if (!(userType === "landlord" || userType === "tenant")) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid user_type, must be landlord or tenant",
    });
  }
  const other_user = userType === "landlord" ? "tenant" : "landlord";
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Chat not found" });
    }

    await checkChatAuthentication(chat, req.body.userId, userType);

    const reversedMessages = [...chat.messages].reverse();
    for (const message of reversedMessages) {
      if (message.sender === other_user) {
        if (message.unread) {
          message.unread = false;
        } else {
          break;
        }
      }
    }
    const newChat = await chat.save();
    return res.status(200).json(newChat);
  } catch (error) {
    console.error(error);
    if (error instanceof AuthenticationError) {
      return res.status(403).json({
        error: error.name,
        message: error.message,
      });
    } else if (error instanceof RequestError) {
      return res.status(400).json({
        error: error.name,
        message: error.message,
      });
    }
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Messages not marked as read",
    });
  }
}

export async function patchArchiveChat(req: Request, res: Response) {
  /**
   * Archive a chat
   * PATCH /chats/:chat_id/archive
   */

  const chat_id = req.params.chat_id;
  if (!isValidObjectId(chat_id)) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid chat_id" });
  }
  try {
    const chat = await Chat.findById(chat_id);

    if (!chat) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Chat not found" });
    }

    await checkChatAuthentication(chat, req.body.userId, null);

    chat.status = "inactive";
    const newChat = await chat.save();
    return res.status(200).json(newChat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Chat not archived",
    });
  }
}

export async function postArchiveChatByProfiles(req: Request, res: Response) {
  /** Archive all chats combining those two profiles
   * POST /chats/searchProfileId/flatProfileId/archive
   *
   */
  const searchProfileId = req.params.searchProfileId;
  const flatProfileId = req.params.flatProfileId;

  if (!isValidObjectId(searchProfileId) || !isValidObjectId(flatProfileId)) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid profile id" });
  }

  try {
    const chats = await Chat.find({
      searchProfile: searchProfileId,
      flatProfile: flatProfileId,
    });

    for (const chat of chats) {
      await checkChatAuthentication(chat, req.body.userId, null);
      chat.status = "inactive";
      await chat.save();
    }
    return res.status(200).json({ message: "Chats archived", data: chats });
  } catch (error) {
    console.error(error);
    if (error instanceof AuthenticationError) {
      return res.status(403).json({
        error: error.name,
        message: error.message,
      });
    } else if (error instanceof RequestError) {
      return res.status(400).json({
        error: error.name,
        message: error.message,
      });
    }
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Chat not archived",
    });
  }
}

export async function getUnreadMessageCount(
  req: Request,
  res: Response
): Promise<Response> {
  /**
   * Get the number of unread messages for a user
   * GET /chats/:user_type/:user_id/unread
   */
  const userId = req.body.userId;
  const userType = req.params.user_type.toLowerCase();

  // check valid user_id
  if (!isValidObjectId(userId)) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid user_id" });
  }

  try {
    const filter = await createFilterForChatsOfUser(userId, userType);
    const chats = (await Chat.find(filter)) || [];
    let unreadCount = 0;
    for (const chat of chats) {
      for (const message of chat.messages) {
        if (message.sender !== userType && message.unread) {
          unreadCount++;
        }
      }
    }

    return res.status(200).send({ unreadCount: unreadCount });
  } catch (error) {
    console.error(error);
    if (error instanceof RequestError) {
      return res.status(400).json({
        error: error.name,
        message: error.message,
      });
    }
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while fetching the chat",
    });
  }
}

export async function getChatPartnerTitleNameAndImage(
  req: Request,
  res: Response
) {
  /**
   * Get the title, name and image of the chat partner
   * GET /chats/:chat_id/:user_type/partner
   */
  const userType = req.params.user_type;
  const chatId = req.params.chat_id;

  if (!isValidObjectId(chatId)) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid chatid" });
  }
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Chat not found" });
    }
    await checkChatAuthentication(chat, req.body.userId, userType);
    let profile;
    if (userType.toLowerCase() === "tenant") {
      profile = await FlatProfile.findById(chat.flatProfile);
    } else if (userType.toLowerCase() === "landlord") {
      profile = await SearchProfile.findById(chat.searchProfile);
    } else {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid user type",
      });
    }
    if (!profile) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Profile not found" });
    }
    const account = await AccountModel.findById(profile.account);
    if (!account) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Account not found" });
    }
    const image_url = account.profilePicture || "";
    return res.status(200).json({
      title: profile.name || "",
      name: `${account.firstName} ${account.lastName}`,
      image: image_url,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AuthenticationError) {
      return res.status(403).json({
        error: error.name,
        message: error.message,
      });
    }
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while fetching the chat partner",
    });
  }
}
