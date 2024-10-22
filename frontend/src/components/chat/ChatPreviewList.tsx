import { Box, Typography, TextField, Divider, List } from "@mui/material";
import ChatPreview from "./ChatPreview.tsx";
import { ChatContext } from "../../contexts/ChatContext.ts";
import React, { useCallback, useContext, useState } from "react";
import { IChat } from "../../types/Chat.ts";

// add prop to get activ index which should also be changed in the ChatPreview component
const ChatPreviewList: React.FC = () => {
  // Get chats from ChatContext UseContext
  const { chats } = useContext(ChatContext);
  const [searchString, setSearchString] = useState<string>("");

  const searchFilter = useCallback(
    (chat: IChat) => {
      if (searchString === "" || !searchString) return true;
      const search = searchString.toLowerCase();
      if (chat.partnerTitle?.toLowerCase().includes(search)) return true;
      if (chat.partnerName?.toLowerCase().includes(search)) return true;
      return chat.messages.some((m) =>
        m.content.toLowerCase().includes(search)
      );
    },
    [searchString]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        width: "50%",
        minWidth: "33em",
        bgcolor: "white", //"background"
        borderRight: "1px solid #E8E6E1",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          padding: "16px",
          borderBottom: "1px solid #E8E6E1",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ marginBottom: "16px", textAlign: "center", color: "#857F72" }}
        >
          Messages
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          InputProps={{
            style: {
              backgroundColor: "white",
              borderRadius: "8px",
              paddingLeft: "8px",
            },
          }}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </Box>
      <Divider />

      <List
        sx={{
          padding: "16px",
          flex: 1,
          overflowY: "auto",
          scrollBehavior: "smooth",
          maxHeight: "100%",
        }}
      >
        {chats && chats.length > 0 ? (
          chats.some(searchFilter) ? (
            chats
              .filter(searchFilter)
              .map((_chat: IChat, index: number) => (
                <ChatPreview key={index} position={index} />
              ))
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Typography>No chats matching your search</Typography>
            </Box>
          )
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography>No chats available</Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default ChatPreviewList;
