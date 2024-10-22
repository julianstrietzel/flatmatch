import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  ButtonBase,
  Avatar,
  IconButton,
  Menu,
  Badge,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Link, useNavigate } from "react-router-dom";
import flatmatchlogovec from "../assets/flatmatchlogovec.svg";
import TryFlatMatchPlusLogo from "../assets/tryflatmatchpluslogovec.svg";
import ProfileNavigation from "./profileNavigation/ProfileNavigation.tsx";
import React, { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  // Use the useAuthContext hook to access the user and logout function
  const { user, logout } = useAuth();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { newMessageCount } = useAuth();
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    logout();
    navigate("/");
  };

  const switchToLogin = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };

  const switchToSignup = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  };

  const handlePremiumClick = () => {
    navigate("/premium");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "white",
      }}
    >
      <Toolbar>
        <ButtonBase component={Link} to="/">
          <img
            src={flatmatchlogovec}
            alt="FlatMatch Logo"
            style={{ width: "40px" }}
          />
          <Typography
            fontWeight="bold"
            variant="h5"
            color={
              user && user.accountType === "landlord"
                ? "primary.main"
                : "yellow.main"
            }
            marginLeft={1}
          >
            Flat
          </Typography>
          <Typography fontWeight="bold" variant="h5" color="text.primary">
            Match
          </Typography>
        </ButtonBase>
        <Box flexGrow={1} />
        {user ? (
          <>
            {!user.premiumUser && user.accountType === "tenant" && (
              <Box mr={3}>
                <Button
                  variant="contained"
                  color="neutral"
                  onClick={handlePremiumClick}
                >
                  <img
                    src={TryFlatMatchPlusLogo}
                    alt="Flat Match Plus"
                    style={{ height: 28 }}
                  />
                </Button>
              </Box>
            )}
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              badgeContent={newMessageCount}
              color="primary"
            >
              <IconButton
                sx={{ marginRight: 1 }}
                onClick={() => navigate("/chat")}
              >
                <ChatBubbleOutlineIcon />
              </IconButton>
            </Badge>
            <Typography variant="h6" color="text.secondary" marginRight={1}>
              Hi,
            </Typography>
            <Typography variant="h6" marginRight={1}>
              {user.firstName}
            </Typography>
            <IconButton onClick={handleMenuOpen}>
              <Avatar alt={user.firstName} src={user.profilePicture} />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              keepMounted
              slotProps={{
                root: {
                  sx: {
                    ".MuiList-root": { padding: 0 },
                    ".MuiPaper-rounded": { borderRadius: 3 },
                  },
                },
              }}
            >
              <ProfileNavigation
                handleLogout={handleLogoutClick}
                handleClose={handleMenuClose}
              />
            </Menu>
          </>
        ) : (
          <>
            <Button variant="text" onClick={() => setLoginOpen(true)}>
              Sign in
            </Button>
            <Button
              variant="contained"
              color="neutral"
              onClick={() => setSignupOpen(true)}
              sx={{ marginLeft: 1, marginRight: 1 }}
            >
              Get Started
            </Button>
          </>
        )}
      </Toolbar>
      {signupOpen && (
        <SignUp
          signupOpen={signupOpen}
          setSignupOpen={setSignupOpen}
          switchToLogin={switchToLogin}
        />
      )}
      {loginOpen && (
        <Login
          loginOpen={loginOpen}
          setLoginOpen={setLoginOpen}
          switchToSignup={switchToSignup}
        />
      )}
    </AppBar>
  );
};

export default Navbar;
