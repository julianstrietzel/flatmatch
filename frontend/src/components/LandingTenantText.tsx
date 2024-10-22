import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingTenantText = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/search-profiles");
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box textAlign="left" maxWidth={600}>
        <Typography variant="h3" component="h1" marginBottom={3}>
          Ready to find your perfect home?
        </Typography>
        <Typography variant="h5" color="text.secondary" marginBottom={5}>
          Now is the ideal time to get started!{" "}
          <span
            style={{ color: theme.palette.yellow[500], fontWeight: "bold" }}
          >
            Set up your search criteria
          </span>{" "}
          and let our platform match you with properties that fit your needs and
          desires.
          <br />
          <br /> Our user-friendly tools make it easy to specify your
          preferences, helping you find the best matches quickly.
        </Typography>
        <Button variant="contained" color="yellow" onClick={handleClick}>
          Set Criteria
        </Button>
      </Box>
    </Box>
  );
};

export default LandingTenantText;
