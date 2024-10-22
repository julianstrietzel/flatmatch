import { Box, Button, SvgIconProps, Typography } from "@mui/material";
import { ComponentType } from "react";
import { useAuth } from "../../hooks/useAuth.ts";

interface ProfileNavigationElementProps {
  Icon: ComponentType<SvgIconProps>;
  title: string;
  subtext: string;
  onClick: () => void;
}

const ProfileNavigationElement = ({
  Icon,
  title,
  subtext,
  onClick,
}: ProfileNavigationElementProps) => {
  const { user } = useAuth();

  const isLandlord = user?.accountType.toLowerCase() === "landlord";

  return (
    <Button
      sx={{
        textTransform: "none",
        textAlign: "left",
        padding: "1",
        width: "100%",
        display: "block",
      }}
      onClick={onClick}
    >
      <Box display="flex" gap={3} alignItems="center" justifyContent="left">
        <Icon
          sx={{ color: isLandlord ? "primary.main" : "yellow.main" }}
          fontSize="large"
        />
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="semibold"
            sx={{ color: isLandlord ? "primary.main" : "yellow.main" }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {subtext}
          </Typography>
        </Box>
      </Box>
    </Button>
  );
};

export default ProfileNavigationElement;
