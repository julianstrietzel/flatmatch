import { Box, Grid, TextField, Typography } from "@mui/material";
import AccountSettingsInfo from "./AccountSettingsInfo.tsx";
import ProfilePictureUpload from "./ProfilePictureUpload.tsx";
import { IAccount } from "../../types/Account.ts";
import DocumentUpload from "./DocumentUpload.tsx";
import { IDocument } from "../../types/Account.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { isTenantUser } from "../../types/User.ts";

interface ProfileAccountInfoProps {
  formData: Partial<IAccount>;
  uploadedDocuments: IDocument[];
  handleChange: (e: { target: { name: string; value: string } }) => void;
  handleImageChange: (file: File | null) => void;
  handleDocumentChange: (documentType: string, file: File | null) => void;
  handleDocumentDelete: (documentId: string) => void;
  handleOpenConfirm: () => void;
  deletePictureDisabled: boolean;
}

const ProfileAccountInfo = ({
  formData,
  uploadedDocuments,
  handleChange,
  handleImageChange,
  handleDocumentChange,
  handleDocumentDelete,
  handleOpenConfirm,
  deletePictureDisabled,
}: ProfileAccountInfoProps) => {
  const { user } = useAuth();

  return (
    <>
      <Grid item xs={12} md={4}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body2">
          This section allows you to introduce yourself to potential landlords
          and highlight what makes you a reliable and desirable tenant.
        </Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="First Name"
                variant="outlined"
                name="firstName"
                value={formData.firstName ?? ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Last Name"
                variant="outlined"
                name="lastName"
                value={formData.lastName ?? ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <ProfilePictureUpload
            profilePicture={formData.profilePicture ?? ""}
            onImageChange={handleImageChange}
            onDeleteClick={handleOpenConfirm}
            deleteDisabled={deletePictureDisabled}
          />
          {user!.premiumUser && isTenantUser(user) && (
            <DocumentUpload
              uploadedDocuments={uploadedDocuments}
              handleDocumentChange={handleDocumentChange}
              handleDocumentDelete={handleDocumentDelete}
            />
          )}
          <AccountSettingsInfo />
          <TextField
            fullWidth
            margin="normal"
            label="About me"
            variant="outlined"
            multiline
            rows={4}
            name="aboutMe"
            value={formData.aboutMe ?? ""}
            onChange={handleChange}
          />
        </Box>
      </Grid>
    </>
  );
};

export default ProfileAccountInfo;
