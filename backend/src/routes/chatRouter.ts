import { Router } from "express";
import {
  getChat,
  getChatPartnerTitleNameAndImage,
  getChatsByUserId,
  getUnreadMessageCount,
  patchArchiveChat,
  postArchiveChatByProfiles,
  postChat,
  postMessage,
  postMessagesofUserRead,
} from "../controllers/chatController";
import authCheck from "../middleware/authCheck";

class ChatRoutes {
  router = Router();

  constructor() {
    this.router.use(authCheck);
    // Api to get a specific chat by id
    this.router.get("/chat/:chat_id", getChat);
    // Api to get all chats by user id and user type {user_id: string, user_type: string}
    this.router.get("/:user_type", getChatsByUserId);
    // Api to create a new chat {landlord: string, tenant: string}
    this.router.post("", postChat);
    // Api to add a message to a chat {message: string, sender_id: string}
    this.router.post("/:chat_id", postMessage);
    // Api to set most recent messages for one person as read
    this.router.post("/:chat_id/:user_type/read", postMessagesofUserRead);
    // Api to set a chat inactive
    this.router.patch("/archive/:chat_id", patchArchiveChat);
    // Api to set all chats matching those ids as inactive
    this.router.post(
      "/:searchProfileId/:flatProfileId/archive",
      postArchiveChatByProfiles
    );
    // Api to get the current number of unread messages for a user
    this.router.get("/:user_type/unread", getUnreadMessageCount);
    // Api to get the name title and image for a partner in chat
    this.router.get(
      "/:chat_id/:user_type/partner",
      getChatPartnerTitleNameAndImage
    );
  }
}

export default new ChatRoutes().router;
