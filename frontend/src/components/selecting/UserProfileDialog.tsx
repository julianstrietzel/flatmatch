import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const Tag = styled(Box)(({ theme }) => ({
  backgroundColor: `${theme.palette.cyan[50]}`,
  borderRadius: "12px",
  padding: "5px 10px",
  margin: "5px 5px 5px 0",
  display: "inline-block",
  color: theme.palette.cyan[800],
  fontWeight: "bold",
}));

interface IUserProfileDialogProps {
  user: {
    name: string;
    images: string[];
    tags: string[];
    about: string;
  };
  open: boolean;
  onClose: () => void;
  onSelect: () => void;
  onDiscard: () => void;
  flatId: string;
  userId: string;
  selected: boolean;
}

const UserProfileDialog: React.FC<IUserProfileDialogProps> = ({
  user,
  open,
  onClose,
  onSelect,
  onDiscard,
  selected,
}) => {
  const [currentImage, setCurrentImage] = useState<number | null>(null);

  if (!user) {
    return null;
  }

  const { name, images, tags, about } = user;

  const handleDiscard = () => {
    onClose();
    onDiscard();
  };

  const handleAccept = () => {
    onSelect();
    onClose();
  };

  const openLightbox = (index: number) => {
    setCurrentImage(index);
  };

  const closeLightbox = () => {
    setCurrentImage(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {name}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap={3}
            width="100%"
          >
            <ImageList
              variant="quilted"
              rowHeight={200}
              gap={8}
              sx={{ width: "100%" }}
            >
              {images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    srcSet={image}
                    src={image}
                    alt={`Image ${index}`}
                    loading="lazy"
                    style={{ width: "100%", cursor: "pointer" }}
                    onClick={() => openLightbox(index)}
                  />
                </ImageListItem>
              ))}
            </ImageList>
            <Box
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              gap={1}
              width="100%"
            >
              {tags && tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
            </Box>
            <Box pb={2} width="100%" color={"neutral.700"}>
              <Typography variant="body1">{about}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "center", gap: 2, pb: 2 }}
        >
          <Button
            onClick={handleDiscard}
            variant="contained"
            sx={{
              backgroundColor: "red.50",
              color: "red.700",
              "&:hover": {
                backgroundColor: "red.100",
              },
            }}
            startIcon={<DeleteIcon />}
          >
            Discard
          </Button>
          {!selected && (
            <Button
              onClick={handleAccept}
              variant="contained"
              sx={{
                backgroundColor: "teal.100",
                color: "teal.700",
                "&:hover": {
                  backgroundColor: "teal.200",
                },
              }}
              startIcon={<CheckCircleIcon />}
            >
              Accept
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {currentImage !== null && (
        <Lightbox
          slides={images.map((src) => ({ src }))}
          open={currentImage !== null}
          close={closeLightbox}
          index={currentImage}
        />
      )}
    </>
  );
};

export default UserProfileDialog;
