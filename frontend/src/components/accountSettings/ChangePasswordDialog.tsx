import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  LinearProgress,
  Alert,
} from "@mui/material";
import { changePassword } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";
import zxcvbn from "zxcvbn";

interface ChangePasswordDialogProps {
  open: boolean;
  handleClose: () => void;
}

const ChangePasswordDialog = ({
  open,
  handleClose,
}: ChangePasswordDialogProps) => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [error, setError] = useState("");

  const { showNotification, hideNotification } = useNotification();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    const passwordEvaluation = zxcvbn(newPassword);
    setPasswordScore(passwordEvaluation.score);
    if (passwordEvaluation.score === 4) {
      setPasswordFeedback("Great password! You're good to go!");
    } else {
      setPasswordFeedback(passwordEvaluation.feedback.suggestions.join("\n"));
    }
  };

  const handleChangePassword = async () => {
    if (oldPassword === newPassword) {
      showNotification({
        message: "New password cannot be the same as the old password.",
        severity: "error",
      });
      return;
    }

    if (newPassword !== repeatNewPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordScore < 3) {
      setError("Password is too weak. Please choose a stronger password.");
      return;
    }

    try {
      const response = await changePassword({
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      showNotification({
        message: response.message,
        severity: "success",
      });

      setOldPassword("");
      setNewPassword("");
      setRepeatNewPassword("");
      setError("");

      setTimeout(() => {
        handleClose();
        hideNotification();
        logout();
        navigate("/");
      }, 2000);
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

      setOldPassword("");
      setNewPassword("");
      setRepeatNewPassword("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleChangePassword();
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    switch (score) {
      case 1:
        return "orange";
      case 2:
        return "yellow.300";
      case 3:
        return "green";
      case 4:
        return "lightgreen";
      default:
        return "red";
    }
  };

  const hasSetPasswords = (): boolean => {
    return (
      oldPassword.length > 0 &&
      newPassword.length > 0 &&
      repeatNewPassword.length > 0
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" p={2} gap={3}>
          <TextField
            label="Old Password"
            type="password"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <TextField
            label="Repeat New Password"
            type="password"
            fullWidth
            value={repeatNewPassword}
            onChange={(e) => setRepeatNewPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <LinearProgress
            variant="determinate"
            value={(passwordScore / 4) * 100}
            sx={{
              mb: 2,
              height: 10,
              borderRadius: 5,
              backgroundColor: "neutral.100",
              "& .MuiLinearProgress-bar": {
                backgroundColor: getPasswordStrengthColor(passwordScore),
              },
            }}
          />
          <Typography variant="body2" color="neutral.main" sx={{ mb: 2 }}>
            {passwordFeedback}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.split("\n").map((msg, index) => (
                <div key={index}>{msg}</div>
              ))}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="neutral"
          onClick={() => {
            setOldPassword("");
            setNewPassword("");
            setRepeatNewPassword("");
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color={user!.accountType === "landlord" ? "primary" : "yellow"}
          onClick={handleChangePassword}
          disabled={!hasSetPasswords() || passwordScore < 3}
        >
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
