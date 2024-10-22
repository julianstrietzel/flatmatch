import { Box } from "@mui/material";
import bottomwaves from "../assets/bottomwaves.svg";
import bottomwaves_landlord from "../assets/bottomwaves_landlord.svg";
import bottomwaves_tenant from "../assets/bottomwaves_tenant.svg";
import { useAuth } from "../hooks/useAuth.ts";

const Footer = () => {
  const { user } = useAuth();
  let waves;
  if (user === null || user.accountType === undefined) {
    waves = bottomwaves;
  } else if (user.accountType?.toLowerCase() == "landlord") {
    waves = bottomwaves_landlord;
  } else if (user.accountType?.toLowerCase() == "tenant") {
    waves = bottomwaves_tenant;
  } else {
    waves = bottomwaves;
    console.log(
      "Invalid user Type in Footer: " +
        user.accountType +
        " Choose from 'landlord', 'tenant'."
    );
  }

  return (
    <Box width="100%" position={"fixed"} bottom="0">
      <img
        src={waves}
        alt="waves"
        style={{
          width: "100%",
          height: "auto",
          marginBottom: "-5px",
        }}
      />
    </Box>
  );
};

export default Footer;
