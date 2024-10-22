import { Typography, Box, Button, Dialog } from "@mui/material";
import landingpage_people_icons from "../assets/landingpage_people_icons.svg";
import { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import YouTube from "react-youtube";
import { useNavigate } from "react-router-dom";

const LandingText = () => {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const videoOptions = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };
  const navigate = useNavigate();

  const switchToLogin = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };

  const switchToSignup = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  };

  const openVideo = () => {
    setVideoOpen(true);
  };

  const closeVideo = () => {
    setVideoOpen(false);
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box textAlign="left" maxWidth={600}>
        <Typography variant="h3" component="h1" marginBottom={3}>
          Connecting Tenants and Landlords Has Never Been Easier!
        </Typography>
        <Typography variant="h5" color={"text.secondary"} marginBottom={5}>
          Our platform simplifies the entire rental process, enabling smarter,
          faster connections—all in one place.
        </Typography>
        <img
          src={landingpage_people_icons}
          alt="people"
          style={{
            maxWidth: 600,
            height: "auto",
            display: "block",
            marginBottom: 10,
          }}
        />
        <Typography variant="body2" color={"text.secondary"} marginBottom={3}>
          Trusted by 300+ SEBA Students
        </Typography>
        <Box display="flex" gap={3}>
          <Button
            variant="contained"
            color="neutral"
            onClick={() => setSignupOpen(true)}
          >
            Get Started
          </Button>
          <Button variant="outlined" color="primary" onClick={openVideo}>
            Watch Demo
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate("/help");
            }}
          >
            FAQ
          </Button>
        </Box>
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
        <Dialog open={videoOpen} onClose={closeVideo} maxWidth="lg">
          <YouTube videoId="dQw4w9WgXcQ" opts={videoOptions} />
        </Dialog>
      </Box>
    </Box>
  );
};

export default LandingText;
