import React, { useEffect, useCallback } from "react";
import { IChat } from "../types/Chat";
import SocketSingleton from "../utils/Socket";
import { sortedChats } from "../utils/ChatUtils";
import { User } from "../types/User.ts";
import { getChatsByUserId } from "../services/chatService.ts";

const useChatSocket = (
  user: User | null,
  setChats: React.Dispatch<React.SetStateAction<IChat[] | undefined>>,
  setSelectedID: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  const handleChatUpdated = useCallback((chat: IChat) => {
    console.log("Chat updated received:", chat);
    setChats((prevChats) => {
      const updatedChats = prevChats?.map((c) =>
        c._id === chat._id ? chat : c
      );
      return sortedChats(updatedChats);
    });
  }, []);

  const handleChatCreated = useCallback((chat: IChat) => {
    console.log("Chat created received:", chat);
    setChats((prevChats) => {
      return prevChats ? sortedChats([...prevChats, chat]) : [chat];
    });
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const socket = SocketSingleton.getInstance(user.id);

    socket.on("chatUpdated", handleChatUpdated);
    socket.on("chatCreated", handleChatCreated);

    getChatsByUserId(user.accountType)
      .then((response) => {
        console.log("Chats received");
        const newChats = sortedChats(response);
        setChats(newChats);
        if (newChats && newChats.length > 0) {
          setSelectedID(newChats[0]._id);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      socket.off("chatUpdated", handleChatUpdated);
      socket.off("chatCreated", handleChatCreated);
    };
  }, [user, handleChatUpdated, handleChatCreated, setSelectedID]);
};

export default useChatSocket;
