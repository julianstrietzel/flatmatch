import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Typography,
  Link,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Alert,
  LinearProgress,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import { signup } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import zxcvbn from "zxcvbn";
import { useNotification } from "../hooks/useNotification";

interface SignUpProps {
  signupOpen: boolean;
  setSignupOpen: (value: boolean) => void;
  switchToLogin: () => void;
}

function SignUp({ signupOpen, setSignupOpen, switchToLogin }: SignUpProps) {
  const theme = useTheme();
  const { setUser } = useAuth();
  const { showNotification } = useNotification();
  const [accountType, setAccountType] = useState<"tenant" | "landlord">(
    "tenant"
  );
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccountType = (
    _event: React.MouseEvent<HTMLElement>,
    newAccountType: "tenant" | "landlord"
  ) => {
    if (newAccountType !== null) {
      setAccountType(newAccountType);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const passwordEvaluation = zxcvbn(newPassword);
    setPasswordScore(passwordEvaluation.score);
    if (passwordEvaluation.score === 4) {
      setPasswordFeedback(
        "Damn, that's a really good password! You'll rock FlatMatch!"
      );
    } else {
      setPasswordFeedback(passwordEvaluation.feedback.suggestions.join("\n"));
    }
  };

  const handleSubmit = async () => {
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordScore < 3) {
      setError("Password is too weak. Please choose a stronger password.");
      return;
    }

    setLoading(true);

    try {
      const { token, user } = await signup({
        email,
        password,
        firstName,
        lastName,
        accountType: accountType.toLowerCase() as "tenant" | "landlord",
      });
      localStorage.setItem("token", token);
      setUser(user);
      setSignupOpen(false);
      setError("");
      showNotification({
        message:
          "Account created successfully! You will receive an email shortly.",
        severity: "success",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Signup error:", error);
        setError(error.message);
      } else {
        console.error("Unexpected error:", error);
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
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
    }
  };

  return (
    <Dialog
      open={signupOpen}
      onClose={() => setSignupOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: "center" }}>Sign Up</DialogTitle>
      <IconButton
        onClick={() => setSignupOpen(false)}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <Box width="100%" maxWidth="400px" sx={{ mb: 4 }}>
            <Typography variant="body2" color="neutral.main">
              Email address:
            </Typography>
            <TextField
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="neutral.main">
              First name:
            </Typography>
            <TextField
              type="text"
              fullWidth
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="neutral.main">
              Last name:
            </Typography>
            <TextField
              type="text"
              fullWidth
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="neutral.main">
              Password:
              <Tooltip
                title="A strong password should be at least 8 characters long, contain a mix of uppercase and lowercase letters, numbers, and special characters."
                placement="right"
              >
                <IconButton>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <TextField
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
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
            <Typography variant="body2" color="neutral.main">
              Repeat password:
            </Typography>
            <TextField
              type="password"
              fullWidth
              variant="outlined"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error.split("\n").map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </Alert>
            )}
          </Box>
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography variant="subtitle1">Select Account Type</Typography>
            <ToggleButtonGroup
              value={accountType}
              exclusive
              onChange={handleAccountType}
              sx={{ mt: 1 }}
            >
              <ToggleButton color="yellow" value="tenant">
                Tenant
              </ToggleButton>
              <ToggleButton color="primary" value="landlord">
                Landlord
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <Box width="50%" marginBottom={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor:
                  accountType === "tenant"
                    ? "yellow.500"
                    : theme.palette.primary.main,
                color: "white",
                "&:hover": {
                  backgroundColor:
                    accountType === "tenant"
                      ? "yellow.500"
                      : theme.palette.primary.main,
                },
              }}
              onClick={handleSubmit}
              disabled={passwordScore < 3 || loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                `Create ${accountType === "tenant" ? "Tenant" : "Landlord"} Account`
              )}
            </Button>
          </Box>
          <Box textAlign="center" marginBottom={4}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link href="#" onClick={switchToLogin}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default SignUp;
