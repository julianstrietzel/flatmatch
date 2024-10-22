import { Box, Button, Typography } from "@mui/material";

interface ProfileNavigationFooterProps {
  handleLogout: () => void;
}

const ProfileNavigationFooter = ({
  handleLogout,
}: ProfileNavigationFooterProps) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      width="100%"
      bgcolor="#FAF9F7"
      mt={1}
      pr={3}
      borderRadius="0px 0px 10px 10px"
    >
      <Button onClick={handleLogout} sx={{ textTransform: "none" }}>
        <Typography>Log out</Typography>
      </Button>
    </Box>
  );
};

export default ProfileNavigationFooter;
