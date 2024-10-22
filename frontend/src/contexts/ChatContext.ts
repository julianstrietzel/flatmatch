import React, { createContext } from "react";
import { IChat } from "../types/Chat.ts";

export const ChatContext = createContext<{
  chats: IChat[] | undefined;
  setChats: React.Dispatch<React.SetStateAction<IChat[] | undefined>>;
  selectedID: string | undefined;
  setSelectedID: React.Dispatch<React.SetStateAction<string | undefined>>;
  updated: boolean;
  setUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  chats: undefined,
  setChats: () => console.error("setChats has no effect"),
  selectedID: undefined,
  setSelectedID: () => console.error("setSelectedIndex has no effect"),
  updated: false,
  setUpdated: () => console.error("setUpdated has no effect"),
});
