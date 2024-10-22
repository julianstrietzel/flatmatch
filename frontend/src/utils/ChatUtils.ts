import { IChat } from "../types/Chat.ts";

export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 7) {
    const userLocale = "en-US"; // navigator.language || navigator.languages[0];
    return date.toLocaleDateString(userLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export const mostRecentMessage = (chat: IChat | undefined) => {
  if (!chat) {
    return undefined;
  }
  if (chat.messages.length === 0) {
    return undefined;
  }
  return chat.messages[chat.messages.length - 1];
};

export const sortedChats = (chats: IChat[] | undefined) => {
  return chats?.sort((a, b) => {
    if (a.messages.length === 0) {
      a.status = "new";
    }
    if (b.messages.length === 0) {
      b.status = "new";
    }
    if (a.status === "new" && b.status === "new") {
      return 0;
    }
    const statusOrder = ["new", "active", "inactive"];
    if (a.status !== b.status) {
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    }

    const aDate = new Date(a.messages[a.messages.length - 1].timestamp);
    const bDate = new Date(b.messages[b.messages.length - 1].timestamp);
    return bDate.getTime() - aDate.getTime();
  });
};
