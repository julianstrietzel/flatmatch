import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChatContext } from "../../contexts/ChatContext.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { sortedChats } from "../../utils/ChatUtils.ts";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { fetchAccount } from "../../services/accountService.ts";
import { IDocument } from "../../types/Account.ts";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DescriptionIcon from "@mui/icons-material/Description";
import { markReadMessages, postMessage } from "../../services/chatService.ts";
import { useNavigate } from "react-router-dom";
import { IMessage } from "../../types/Chat.ts";

type ChatMessageListProps = {
  userType: "landlord" | "tenant";
};

const ChatMessageList: React.FC<ChatMessageListProps> = ({ userType }) => {
  const { user } = useAuth();
  const { chats, selectedID, setChats, updated } = useContext(ChatContext);
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { setNewMessageCount } = useAuth();
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const formatTimestamp = useCallback(
    (message: IMessage) => {
      const date = new Date(message.timestamp);
      if (isNaN(date.getTime())) {
        return "";
      }
      const today = new Date();
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        // locale german time string only smaller
        return date.toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        return date.toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchDocuments = async () => {
      try {
        const account = await fetchAccount(user.id);
        setDocuments(account.documents);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDocuments();
  }, [user]);

  const activeChat = useMemo(
    () =>
      selectedID ? chats?.find((chat) => chat._id === selectedID) : undefined,
    [selectedID, chats, updated]
  );

  const sendMessage = useCallback(
    (selectedDocument: string = "") => {
      const trimmedMessage = message.trim();
      if (selectedDocument === "" && trimmedMessage === "") {
        console.log("Trying to send empty message");
        return;
      }

      if (!chats || !activeChat) {
        console.error("No active chat");
        return;
      }

      let newMessage: IMessage;

      if (selectedDocument !== "") {
        newMessage = {
          content: selectedDocument,
          sender: userType,
          timestamp: new Date(),
          unread: true,
          documentURL: documents.find(
            (doc) => doc.documentType === selectedDocument
          )?.documentURL,
        };
      } else {
        newMessage = {
          content: trimmedMessage,
          sender: userType,
          timestamp: new Date(),
          unread: true,
        };
      }

      if (selectedID) {
        postMessage(selectedID, newMessage)
          .then(() => {
            console.log("Message sent");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.error("No chat selected");
      }

      setMessage("");
      const updatedChat = {
        ...activeChat,
        messages: [...activeChat.messages, newMessage],
        status: activeChat.status === "new" ? "active" : activeChat.status,
      };

      setChats((prevChats) =>
        sortedChats(
          prevChats?.map((c) => (c._id === activeChat._id ? updatedChat : c))
        )
      );
    },
    [message, userType, selectedID, chats, activeChat, documents]
  );

  useEffect(() => {
    // scroll to bottom on Render
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
    // mark messages as read
    if (chats && activeChat) {
      const unreadMessages = activeChat.messages.filter(
        (m) => m.sender !== userType && m.unread
      );

      if (unreadMessages.length > 0) {
        setNewMessageCount((prevCount) =>
          Math.max(0, prevCount - unreadMessages.length)
        );

        if (activeChat._id) {
          markReadMessages(activeChat._id, userType)
            .then((response) => {
              console.log("Messages marked as read");

              setChats((prevChats) =>
                sortedChats(
                  prevChats?.map((c) =>
                    c._id === activeChat._id ? response : c
                  )
                )
              );
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          console.error("No chat selected");
        }
      }
    }
  }, [chats, activeChat, userType]);

  const handleAttachmentClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDocumentSelect = (documentType: string) => {
    setAnchorEl(null);
    sendMessage(documentType);
  };

  const handleAccountRedirect = () => {
    setAnchorEl(null);
    navigate("/account");
  };

  return (
    <Box display="flex" flexDirection="column" width="70%" bgcolor="white">
      {selectedID ? (
        <>
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              padding: "8px",
            }}
          >
            {activeChat &&
            activeChat.messages &&
            activeChat.messages.length > 0 ? (
              activeChat.messages.map((message, index) => (
                <Paper
                  key={index}
                  sx={{
                    backgroundColor:
                      message.sender === userType
                        ? userType === "landlord"
                          ? "primary.100"
                          : "yellow.100"
                        : "grey.100",
                    alignSelf:
                      message.sender === userType ? "flex-end" : "flex-start",
                    color: "white",
                    margin: "10px",
                    padding: "10px",
                    maxWidth: "70%",
                    width: "fit-content",
                    //wrap if content is too long
                    whiteSpace: "pre-wrap",

                    boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {message.documentURL ? (
                    <Typography color="black">
                      <a
                        href={message.documentURL}
                        target="_blank"
                        style={{
                          textDecoration: "underline",
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <DescriptionIcon style={{ marginRight: "8px" }} />
                        {message.content[0].toUpperCase() +
                          message.content.slice(1)}
                      </a>
                    </Typography>
                  ) : (
                    <Typography color="black">{message.content}</Typography>
                  )}
                  <Box
                    sx={{
                      flexDirection: "row",
                      display: "flex",
                      justifyContent:
                        message.sender === userType ? "flex-end" : "flex-start",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "black",
                      }}
                    >
                      {formatTimestamp(message)}
                    </Typography>
                  </Box>
                </Paper>
              ))
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Typography>No messages available</Typography>
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>
          {activeChat?.status !== "inactive" && (
            <Box
              sx={{
                display: "flex",
                padding: "8px",
                borderTop: "1px solid #ccc",
              }}
            >
              {user?.premiumUser && (
                <>
                  <IconButton
                    onClick={handleAttachmentClick}
                    sx={{ marginRight: "8px", padding: "16px" }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    {documents.length > 0 ? (
                      documents.map((document) => (
                        <MenuItem
                          key={document._id}
                          onClick={() =>
                            handleDocumentSelect(document.documentType)
                          }
                        >
                          {document.documentType[0].toUpperCase() +
                            document.documentType.slice(1)}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem onClick={handleAccountRedirect}>
                        Upload Documents
                      </MenuItem>
                    )}
                  </Menu>
                </>
              )}
              <TextField
                variant="outlined"
                placeholder="Type a message"
                fullWidth
                value={message}
                sx={{ marginRight: "8px" }}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevents the addition of a new line in the TextField by default
                    sendMessage();
                  }
                }}
              />
              <Button
                variant="contained"
                color={userType === "landlord" ? "primary" : "yellow"}
                onClick={() => sendMessage("")}
                disabled={!message.trim()}
              >
                Send
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Typography>No chat selected</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatMessageList;
