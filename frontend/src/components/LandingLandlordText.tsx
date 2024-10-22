import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingLandlordText = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/flat-profiles");
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box textAlign="left" maxWidth={600}>
        <Typography variant="h3" component="h1" marginBottom={3}>
          Ready to list your property?
        </Typography>
        <Typography variant="h5" color="text.secondary" marginBottom={5}>
          Now is the perfect time to get started!{" "}
          <span
            style={{ color: theme.palette.primary.main, fontWeight: "bold" }}
          >
            Create your first listing
          </span>{" "}
          and let our platform connect you with potential tenants.
          <br />
          <br /> Our user-friendly tools make it easy to showcase your property
          and attract the right matches.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Create Listing
        </Button>
      </Box>
    </Box>
  );
};

export default LandingLandlordText;
