import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Box, Typography } from "@mui/material";
import { confirmEmailApi } from "../api/authApi";

const ConfirmEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setError("Invalid token.");
        return;
      }

      try {
        const response = await confirmEmailApi(token);
        setMessage(response.data.message);

        // Automatically navigate to the root path after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setError(error.response.data.message || "Email confirmation failed.");
        } else {
          setError("Email confirmation failed.");
        }
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h4" mt={2}>
        Email Confirmation
      </Typography>
      <Typography variant="body1" mt={2}>
        {message || error || "Confirming your email..."}
      </Typography>
    </Box>
  );
};

export default ConfirmEmail;
