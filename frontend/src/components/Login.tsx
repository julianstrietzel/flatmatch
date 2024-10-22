import { useState } from "react";
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
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { login } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

interface LoginProps {
  loginOpen: boolean;
  setLoginOpen: (value: boolean) => void;
  switchToSignup: () => void;
}

function Login({ loginOpen, setLoginOpen, switchToSignup }: LoginProps) {
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async () => {
    setLoading(true);
    try {
      const response = await login({
        email,
        password,
      });

      const { token } = response;
      localStorage.setItem("token", token);

      setUser(response.user);
      setLoginOpen(false);
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        setError(error.message);
      } else {
        console.error("Unexpected error", error);
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleLoginClick();
    }
  };

  return (
    <Dialog
      open={loginOpen}
      onClose={() => setLoginOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: "center" }}>Login</DialogTitle>
      <IconButton
        onClick={() => setLoginOpen(false)}
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
              Password:
            </Typography>
            <TextField
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ mb: 2 }}
            />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.split("\n").map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="center"
        >
          <Box width="70%" marginBottom={4}>
            <Button
              sx={{
                background:
                  "linear-gradient(to right, #4C9CA4 30%, #E3B04A 90%)",
                color: "white",
              }}
              fullWidth
              onClick={handleLoginClick}
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Box>
          <Box textAlign="left" mb={2} width="100%" paddingLeft={2}>
            <Typography variant="body2">
              Missing an account?{" "}
              <Link href="#" onClick={switchToSignup}>
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default Login;
