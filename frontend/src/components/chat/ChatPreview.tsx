import {
  Avatar,
  Badge,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  formatDate,
  mostRecentMessage,
  truncateText,
} from "../../utils/ChatUtils.ts";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ChatContext } from "../../contexts/ChatContext.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import {
  getChatPartner,
  patchArchiveChat,
} from "../../services/chatService.ts";

const ChatPreview = ({ position }: { position: number }) => {
  const { selectedID, setSelectedID } = useContext(ChatContext);
  const { user } = useAuth();

  const { chats, setChats, updated, setUpdated } = useContext(ChatContext);
  const activeChat = useMemo(
    () => chats![position],
    [chats, position, updated]
  );

  const [title, setTitle] = useState<string>(
    activeChat.partnerTitle || "Loading Profile Title..."
  );
  const [name, setName] = useState<string>(
    activeChat.partnerName || "Loading Account Name..."
  );
  const [image, setImage] = useState<string>("/FlatMatchLogoVec.png");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  useEffect(() => {
    if (!(activeChat.partnerName && activeChat.partnerTitle)) {
      getChatPartner(activeChat._id!, user!.accountType)
        .then((response) => {
          setTitle(response.title);
          setName(response.name);
          setImage(response.image);
          setChats((prevChats) => {
            if (!prevChats) return prevChats;
            const updatedChat = prevChats[position];
            updatedChat.partnerTitle = response.title;
            updatedChat.partnerName = response.name;
            updatedChat.partnerImage = response.image;
            prevChats[position] = updatedChat;
            return prevChats;
          });
        })
        .catch((error) => console.error(error));
    }
  }, [activeChat._id, position, setChats]);

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (activeChat.status === "inactive") {
      return;
    }
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleArchive = useCallback(() => {
    patchArchiveChat(activeChat._id!)
      .then(() => {
        const chat = chats![position];
        chat.status = "inactive";
        chats![position] = chat;
        setChats(chats);
        setUpdated(!updated);
      })
      .catch((error) => {
        console.error("Error archiving chat " + activeChat._id + ":", error);
      });
    setMenuAnchor(null);
  }, [activeChat._id, chats, position]);

  if (!user) {
    return null;
  }
  const isLandlord = user.accountType.toLowerCase() === "landlord";

  return (
    <Box
      display="flex"
      alignItems="center"
      padding={2}
      bgcolor={
        activeChat._id === selectedID
          ? isLandlord
            ? "primary.100"
            : "yellow.100"
          : "neutral.100"
      }
      borderRadius={6}
      marginBottom={2}
      onClick={() => setSelectedID(activeChat._id)}
      onContextMenu={handleContextMenu}
      sx={{
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
        },
        position: "relative",
      }}
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          activeChat.status === "inactive" ? (
            <NewBadge style={{ backgroundColor: "grey" }}>Archived</NewBadge>
          ) : activeChat.status === "new" ||
            (mostRecentMessage(activeChat)?.unread &&
              mostRecentMessage(activeChat)?.sender !== user.accountType) ? (
            <NewBadge>New</NewBadge>
          ) : null
        }
      >
        <Avatar
          src={image!}
          alt={"profile image of sender"}
          sx={{ width: 56, height: 56 }}
        />
      </Badge>
      <Box marginLeft={4} flex={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {truncateText(name, 25)}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {truncateText(title, 20)}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {truncateText(
            mostRecentMessage(activeChat)
              ? (user.accountType === mostRecentMessage(activeChat)?.sender
                  ? "You"
                  : "Them") +
                  ": " +
                  mostRecentMessage(activeChat)?.content
              : "No messages",
            30
          )}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{
          marginLeft: "auto",
          alignSelf: "flex-start",
          fontWeight: "bold",
          marginRight: 4,
        }}
      >
        {!mostRecentMessage(activeChat)
          ? ""
          : formatDate(mostRecentMessage(activeChat)!.timestamp)}
      </Typography>
      <IconButton
        onClick={handleContextMenu}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {activeChat.status !== "inactive" ? (
          <MenuItem onClick={handleArchive}>Archive Chat</MenuItem>
        ) : (
          <MenuItem onClick={handleMenuClose}>
            Sry this is an archived chat.
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

const NewBadge = styled("span")(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: "white",
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  fontSize: 10,
  fontWeight: "bold",
  textTransform: "uppercase",
}));

export default ChatPreview;
