import { Box, Button, List, Typography } from "@mui/material";
import FlatMatchPlusLogo from "../../assets/flatmatchpluslogovec.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";
import { FeatureElement } from "../premiumFeatures/FeatureElement.tsx";
import { useEffect } from "react";

const SwipingLandingAd = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const handlePremiumClick = () => {
    navigate("/premium");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {user && user.premiumUser ? (
          <>
            <Typography variant="h6">
              Thank you for choosing FlatMatch Plus
            </Typography>
            <List>
              <FeatureElement text={"Unlimited Likes"} premiumFeature={true} />
              <FeatureElement
                text={"No Advertisements"}
                premiumFeature={true}
              />
              <FeatureElement
                text={"Upload Personal Documents"}
                premiumFeature={true}
              />
            </List>
          </>
        ) : (
          <>
            <Typography variant="h5">Get the best experience:</Typography>
            <Button onClick={handlePremiumClick}>
              <img src={FlatMatchPlusLogo} alt="FlatMatchPlusLogo" />
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SwipingLandingAd;
