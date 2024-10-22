import { Box } from "@mui/material";
import LandingText from "../components/LandingText";
import landingpagecards from "../assets/landingpage_cards.svg";
import landingtenant_people from "../assets/landingtenant_people.svg";
import landinglandlord_house from "../assets/landinglandlord_house.svg";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import LandingLandlordText from "../components/LandingLandlordText";
import LandingTenantText from "../components/LandingTenantText";
import { isLandlordUser, isTenantUser } from "../types/User";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (isTenantUser(user) && user.profile) {
        navigate("/tenantLanding");
      } else if (
        isLandlordUser(user) &&
        user.profiles &&
        user.profiles?.length > 0
      ) {
        navigate("/selection");
      }
    }
  }, [user, navigate]);
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ height: "calc(100vh) - 64px" }}
      mt="64px"
    >
      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          width="100%"
          maxWidth="1400px"
        >
          <Box flex="1" minWidth="400px" p={2}>
            {user?.accountType === "tenant" ? (
              <LandingTenantText />
            ) : user?.accountType === "landlord" ? (
              <LandingLandlordText />
            ) : (
              <LandingText />
            )}
          </Box>
          <Box
            flex="1"
            minWidth="400px"
            p={2}
            display="flex"
            justifyContent="center"
          >
            <img
              src={
                user?.accountType === "tenant"
                  ? landingtenant_people
                  : user?.accountType === "landlord"
                    ? landinglandlord_house
                    : landingpagecards
              }
              alt={"Image"}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};
export default LandingPage;
