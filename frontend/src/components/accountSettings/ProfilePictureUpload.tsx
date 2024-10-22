import { Avatar, Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ChangeEvent } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { useNotification } from "../../hooks/useNotification.ts";

interface ProfilePictureUploadProps {
  profilePicture: string;
  onImageChange: (file: File | null) => void;
  onDeleteClick: () => void;
  deleteDisabled: boolean;
}

const ProfilePictureUpload = ({
  profilePicture,
  onImageChange,
  onDeleteClick,
  deleteDisabled,
}: ProfilePictureUploadProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      if (files.length > 1) {
        showNotification({
          message: "Please select only a single image",
          severity: "error",
        });
      } else {
        const file = files[0];
        const validImageTypes = ["image/jpeg", "image/png"];
        if (validImageTypes.includes(file.type)) {
          onImageChange(file);
        } else {
          showNotification({
            message: "Valid image types: jpeg or png",
            severity: "error",
          });
        }
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="start"
      gap={2}
      mb={3}
    >
      <Typography variant="body1" color="textSecondary">
        Profile Picture
      </Typography>
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar
          alt="Profile picture"
          src={profilePicture}
          sx={{ width: 80, height: 80 }}
        />
        <Button
          component="label"
          variant="contained"
          color={user!.accountType === "landlord" ? "primary" : "yellow"}
          startIcon={<CloudUploadIcon />}
        >
          Change Picture
          <input
            type="file"
            hidden
            onChange={handleImageChange}
            accept="image/jpeg, image/png"
          />
        </Button>
        <Button
          variant="outlined"
          color={user!.accountType === "landlord" ? "primary" : "yellow"}
          onClick={onDeleteClick}
          disabled={deleteDisabled}
        >
          Delete Picture
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePictureUpload;
