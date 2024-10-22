import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { reAuth } from "../services/authService.ts";
import { useAuth } from "../hooks/useAuth.ts";
import FlatMatchPlusLogo from "../assets/flatmatchpluslogovec.svg";
import { useNavigate } from "react-router-dom";

const PaymentResultPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const reAuthenticate = async () => {
      try {
        const response = await reAuth();

        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);

        setUser(response.user);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
        } else {
          console.error("Unexpected error", error);
        }
      }
    };

    reAuthenticate();

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    // Clear timeout if component unmounts
    return () => clearTimeout(timer);
  }, [navigate, setUser]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt={5}
      gap={3}
    >
      {user?.premiumUser && (
        <>
          <Typography variant="h4">Thank you for choosing</Typography>
          <img src={FlatMatchPlusLogo} alt="FlatMatch Plus" />
        </>
      )}
      <Typography variant="h4">Redirecting...</Typography>
    </Box>
  );
};

export default PaymentResultPage;
