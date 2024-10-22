import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {
  deleteAccount,
  deleteDocuments,
  deleteProfilePicture,
  fetchAccount,
  updateAccount,
  updateDocuments,
  updateProfilePicture,
} from "../services/accountService.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { IAccount } from "../types/Account.ts";
import ConfirmationDialog from "../components/accountSettings/ConfirmationDialog.tsx";
import BasicAccountInfo from "../components/accountSettings/BasicAccountInfo.tsx";
import ProfileAccountInfo from "../components/accountSettings/ProfileAccountInfo.tsx";
import ChangePasswordDialog from "../components/accountSettings/ChangePasswordDialog.tsx";
import Footer from "../components/Footer.tsx";
import { useNotification } from "../hooks/useNotification.ts";
import { IDocument } from "../types/Account.ts";

const AccountSettingsPage = () => {
  const [formData, setFormData] = useState<Partial<IAccount>>({
    email: "",
    language: "",
    country: "",
    city: "",
    firstName: "",
    lastName: "",
    aboutMe: "",
    profilePicture: "",
  });
  const [initialFormData, setInitialFormData] = useState<Partial<IAccount>>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [uploadedDocuments, setUploadDocuments] = useState<IDocument[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { showNotification } = useNotification();
  const { user, setUser, logout, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchAccountData = async () => {
      try {
        const account = await fetchAccount(user.id);
        setFormData(account);
        setInitialFormData(account);
        setUploadDocuments(account.documents);
      } catch (error: unknown) {
        console.error(`Failed to fetch account: ${error}`);
        showNotification({
          message: "Account not found",
          severity: "error",
        });
      }
    };

    if (!authLoading) {
      fetchAccountData();
    }
  }, [user, navigate, authLoading]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value || "",
    }));
  };

  const handleImageChange = (file: File | null) => {
    const image = file;

    let imageUrl = "";
    if (image) imageUrl = URL.createObjectURL(image);
    setFormData((prevState) => ({
      ...prevState,
      profilePicture: imageUrl,
    }));
    setProfileImage(image);
  };

  const handleDocumentChange = async (
    fileType: string,
    file: File | null
  ): Promise<void> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!file) return resolve();

      try {
        const updatedDocuments = await updateDocuments(
          user!.id,
          fileType,
          file
        );
        setUploadDocuments(updatedDocuments);
        showNotification({
          message: "Document uploaded successfully",
          severity: "success",
        });
        resolve();
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
          showNotification({
            message: error.message,
            severity: "error",
          });
        }
        reject(error);
      }
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    setIsUpdating(true);

    try {
      const updatedAccount = await updateAccount({
        id: user.id,
        email: formData.email,
        language: formData.language,
        country: formData.country,
        city: formData.city,
        firstName: formData.firstName,
        lastName: formData.lastName,
        aboutMe: formData.aboutMe,
      });

      let newProfilePicture = formData.profilePicture;

      if (profileImage) {
        newProfilePicture = (await updateProfilePicture(user.id, profileImage))
          .imageUrl;
      }

      setUser({
        ...user,
        email: updatedAccount.email,
        firstName: updatedAccount.firstName,
        lastName: updatedAccount.lastName,
        profilePicture: newProfilePicture ?? "",
        aboutMe: updatedAccount.aboutMe,
      });

      showNotification({
        message: "Profile updated successfully",
        severity: "success",
      });
      setInitialFormData(formData);
    } catch (error: unknown) {
      console.error(error);
      let errorMessage: string | string[] = "";
      if (Array.isArray(error)) {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      showNotification({
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setProfileImage(null);
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(user!.id);
      logout();
      navigate("/");
      showNotification({
        message: "Successfully deleted account",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      showNotification({
        message: "An error occurred",
        severity: "error",
      });
    }
  };

  const handleDeletePicture = async () => {
    if (user == null) {
      navigate("/");
      alert("Please log in to access your account");
      return;
    }

    try {
      await deleteProfilePicture(user.id);

      setUser({
        ...user,
        profilePicture: "",
      });

      setFormData((prevState) => ({
        ...prevState,
        profilePicture: "",
      }));

      showNotification({
        message: "Profile picture deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      showNotification({
        message: "Failed to delete profile picture",
        severity: "error",
      });
    }
  };

  const handleDocumentDelete = async (documentId: string) => {
    try {
      const updatedDocuments = await deleteDocuments(user!.id, documentId);
      setUploadDocuments(updatedDocuments);
      showNotification({
        message: "Document deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to delete document:", error);
      showNotification({
        message: "Failed to delete document",
        severity: "error",
      });
    }
  };

  const hasFormChanged = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  const handleOpenConfirm = () => {
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmDialogOpen(false);
  };

  const handleOpenDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleOpenPassword = () => {
    setPasswordDialogOpen(true);
  };

  const handleClosePassword = () => {
    setPasswordDialogOpen(false);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="start"
        margin="auto"
        width="80%"
        mt={5}
        mb={20}
      >
        <Typography variant="h5" mb={3}>
          Account Settings
        </Typography>
        <Divider sx={{ width: "100%" }} />
        <Grid container spacing={2} alignItems="flex-start" my={3}>
          <BasicAccountInfo
            formData={formData}
            handleChange={handleChange}
            handleOpenPassword={handleOpenPassword}
          />
        </Grid>
        <Divider sx={{ width: "100%" }} />
        <Grid container spacing={2} alignItems="flex-start" mt={3}>
          <ProfileAccountInfo
            formData={formData}
            uploadedDocuments={uploadedDocuments}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            handleDocumentChange={handleDocumentChange}
            handleDocumentDelete={handleDocumentDelete}
            handleOpenConfirm={handleOpenConfirm}
            deletePictureDisabled={user?.profilePicture == undefined}
          />
        </Grid>
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          mt={3}
          gap={3}
        >
          <Button variant="outlined" onClick={handleOpenDelete}>
            Delete Account
          </Button>
          <Box display="flex" gap={3}>
            <Button
              variant="outlined"
              color={user!.accountType === "landlord" ? "primary" : "yellow"}
              onClick={handleCancel}
              disabled={!hasFormChanged()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color={user!.accountType === "landlord" ? "primary" : "yellow"}
              onClick={handleSubmit}
              disabled={!hasFormChanged()}
            >
              {isUpdating ? <CircularProgress size={24} /> : "Change"}
            </Button>
          </Box>
        </Box>
        <ConfirmationDialog
          open={confirmDialogOpen}
          onClose={handleCloseConfirm}
          onConfirm={() => {
            handleDeletePicture();
            handleCloseConfirm();
          }}
          title="Confirm Deletion"
          content="Are you sure you want to delete your profile picture?"
        />
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleCloseDelete}
          onConfirm={() => {
            handleDelete();
            handleCloseDelete();
          }}
          title={"Confirm Deletion"}
          content={
            "Are you sure you want to delete your account? This action cannot be undone"
          }
        />
        <ChangePasswordDialog
          open={passwordDialogOpen}
          handleClose={handleClosePassword}
        />
      </Box>
      <Footer />
    </>
  );
};

export default AccountSettingsPage;
