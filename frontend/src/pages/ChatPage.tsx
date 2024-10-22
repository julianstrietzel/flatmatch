import { useEffect, useState } from "react";
import ChatPreviewList from "../components/chat/ChatPreviewList";
import ChatMessageList from "../components/chat/ChatMessageList";
import { Box } from "@mui/material";
import { ChatContext } from "../contexts/ChatContext";
import { IChat } from "../types/Chat";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useChatSocket from "../hooks/useChatSocket";

const ChatPage = () => {
  const [chats, setChats] = useState<IChat[] | undefined>([]);
  const [selectedID, setSelectedID] = useState<string | undefined>(undefined);
  const [updated, setUpdated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useChatSocket(user, setChats, setSelectedID);

  useEffect(() => {
    if (!user || !user?.id) {
      return;
    }
  }, [user, navigate]);

  if (!user || !user?.id) {
    return null;
  }
  return (
    <Box sx={{ height: "calc(100vh - 64px)" }}>
      <ChatContext.Provider
        value={{
          chats,
          setChats,
          selectedID,
          setSelectedID,
          updated,
          setUpdated,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
          <ChatPreviewList />
          <ChatMessageList userType={user.accountType} />
        </Box>
      </ChatContext.Provider>
    </Box>
  );
};

export default ChatPage;
