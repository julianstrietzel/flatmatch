import React, { useState } from "react";
import { Box, Card, Typography, Button, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import UserProfileDialog from "./UserProfileDialog";
import DiscardConfirmationDialog from "./DiscardConfirmationDialog";

interface ISelectionCard {
  id: string;
  name: string;
  profileImage: string;
  images: string[];
  tags: string[];
  about: string;
  onSelect: () => void;
  onDiscard: () => void;
  selected: boolean;
  emailConfirmed: boolean;
  flatId: string;
}

interface StyledCardProps {
  selected: boolean;
  profileImage: string;
}

const TenantCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "selected" && prop !== "profileImage",
})<StyledCardProps>(({ selected, profileImage, theme }) => ({
  width: "300px",
  height: "400px",
  margin: "10px",
  position: "relative",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  border: selected ? `4px solid ${theme.palette.teal[200]}` : "none",
  transition: "border 0.3s, transform 0.3s",
  transform: selected ? "scale(1.05)" : "scale(1)",
  cursor: "pointer",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundImage: `url(${profileImage})`,
}));

const GradientOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  width: "100%",
  height: "50%",
  background: `linear-gradient(to top, ${theme.palette.cyan[900]}, ${theme.palette.cyan[50]}00)`,
  color: "#fff",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
}));

const SelectedBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 10,
  left: 10,
  backgroundColor: theme.palette.teal[50],
  color: theme.palette.teal[300],
  padding: "3px 8px",
  borderRadius: "5px",
}));

const TenantTag = styled(Box)(({ theme }) => ({
  backgroundColor: `${theme.palette.cyan[50]}E6`,
  borderRadius: "12px",
  padding: "5px 10px",
  margin: "5px 5px 5px 0",
  display: "inline-block",
  opacity: 0.9,
  color: theme.palette.cyan[800],
  fontWeight: "bold",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  marginTop: "10px",
  width: "150px",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const MAX_TAGS_DISPLAY = 4; // Maximum number of tags to display

function SelectionCard({
  id,
  name,
  profileImage,
  images,
  tags,
  about,
  onSelect,
  onDiscard,
  selected,
  emailConfirmed,
  flatId,
}: ISelectionCard) {
  const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
  const [openDiscardDialog, setOpenDiscardDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleProfileOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenProfileDialog(true);
  };

  const handleProfileClose = () => {
    setOpenProfileDialog(false);
  };

  const handleDiscardConfirm = () => {
    setOpenDiscardDialog(true);
  };

  const handleDiscardCancel = () => {
    setOpenDiscardDialog(false);
  };

  const handleDiscard = () => {
    onDiscard();
    setOpenDiscardDialog(false);
  };

  const handleAccept = () => {
    onSelect();
    setOpenProfileDialog(false);
  };

  const handleCardClick = () => {
    setOpenProfileDialog(true);
  };

  const handleChatClick = () => {
    navigate("/chat");
  };

  const visibleTags = tags.slice(0, MAX_TAGS_DISPLAY);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <TenantCard
        selected={selected}
        profileImage={profileImage}
        onClick={handleCardClick}
      >
        {selected && <SelectedBadge>Selected</SelectedBadge>}
        <GradientOverlay>
          <Box display="flex" alignItems="center">
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {name}
            </Typography>
            {emailConfirmed && (
              <Tooltip title="Email Confirmed" arrow>
                <CheckCircleIcon sx={{ color: "teal.200", ml: 1 }} />
              </Tooltip>
            )}
          </Box>
          <Box display="flex" flexWrap="wrap" mt={1}>
            {visibleTags.map((tag, index) => (
              <TenantTag key={index}>{tag}</TenantTag>
            ))}
          </Box>
        </GradientOverlay>
      </TenantCard>
      <ActionButton
        variant="contained"
        fullWidth
        onClick={selected ? handleChatClick : handleProfileOpen}
      >
        {selected ? "Chat" : "Details"}
      </ActionButton>
      <UserProfileDialog
        user={{ name, images, tags, about }}
        open={openProfileDialog}
        onClose={handleProfileClose}
        onSelect={handleAccept}
        onDiscard={handleDiscardConfirm}
        flatId={flatId}
        userId={id}
        selected={selected}
      />
      <DiscardConfirmationDialog
        open={openDiscardDialog}
        onClose={handleDiscardCancel}
        onConfirm={handleDiscard}
        name={name}
      />
    </Box>
  );
}

export default SelectionCard;
