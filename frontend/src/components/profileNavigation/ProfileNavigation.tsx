import { Box, Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MessageIcon from "@mui/icons-material/Message";
import HelpIcon from "@mui/icons-material/Help";
import { useNavigate } from "react-router-dom";
import ProfileNavigationElement from "./ProfileNavigationElement.tsx";
import ProfileNavigationFooter from "./ProfileNavigationFooter.tsx";
import { useAuth } from "../../hooks/useAuth.ts";
import { TenantUser, LandlordUser } from "../../types/User.ts";
import { useNotification } from "../../hooks/useNotification.ts";

interface ProfileNavigationProps {
  handleLogout: () => void;
  handleClose: () => void;
}

const ProfileNavigation = ({
  handleLogout,
  handleClose,
}: ProfileNavigationProps) => {
  const { user } = useAuth();
  const isLandlord = user?.accountType.toLowerCase() === "landlord";
  const flatProfileId = (user as LandlordUser)?.profiles;
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleOpenAccount = () => {
    navigate("/account");
    handleClose();
  };

  const handleOpenProfile = () => {
    if (isLandlord) {
      if (flatProfileId) {
        navigate(`/edit-flat-profiles`);
      } else {
        navigate("/flat-profiles");
        showNotification({
          message: "There is no created flat-profile yet!",
          severity: "info",
        });
      }
    } else {
      if ((user! as TenantUser).profile!) {
        navigate(`/edit-search-profiles`);
      } else {
        navigate("/search-profiles");
      }
    }
    handleClose();
  };

  const handleOpenChat = () => {
    navigate("/chat");
    handleClose();
  };

  const handleOpenHelp = () => {
    navigate("/help");
    handleClose();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      boxShadow={3}
      borderRadius={3}
      width="630px"
    >
      <Grid container spacing={3} px={3} pt={2}>
        <Grid item xs={6}>
          <ProfileNavigationElement
            Icon={PersonIcon}
            title="Account"
            subtext="Update your details and settings"
            onClick={handleOpenAccount}
          />
        </Grid>
        <Grid item xs={6}>
          <ProfileNavigationElement
            Icon={MapsHomeWorkIcon}
            title={isLandlord ? "Properties" : "Search Criteria"}
            subtext={
              isLandlord
                ? "Manage all your property listings"
                : "Manage your search criteria"
            }
            onClick={handleOpenProfile}
          />
        </Grid>
        <Grid item xs={6}>
          <ProfileNavigationElement
            Icon={MessageIcon}
            title="Messages"
            subtext={
              isLandlord
                ? "Communicate with tenants"
                : "Communicate with landlords"
            }
            onClick={handleOpenChat}
          />
        </Grid>
        <Grid item xs={6}>
          <ProfileNavigationElement
            Icon={HelpIcon}
            title="Help Center"
            subtext="Get quick help and support"
            onClick={handleOpenHelp}
          />
        </Grid>
      </Grid>
      <ProfileNavigationFooter handleLogout={handleLogout} />
    </Box>
  );
};

export default ProfileNavigation;
