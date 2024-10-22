import React, { useEffect, useState } from "react";
import { Box, Fade, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useAuth } from "../../hooks/useAuth.ts";

interface AccountSettingsInfoProps {
  messages?: string[];
  intervalDuration?: number;
}

const defaultMessages = [
  "A good profile picture boosts trust and appeal, enhancing your visibility.",
  "Keeping your profile up to date helps to know more about you.",
  "Ensure your contact information is accurate to receive important updates.",
  "A detailed 'About Me' section can help understand your preferences better.",
];

const AccountSettingsInfo: React.FC<AccountSettingsInfoProps> = ({
  messages = defaultMessages,
  intervalDuration = 5000,
}) => {
  const [infoIndex, setInfoIndex] = useState<number>(0);
  const [show, setShow] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setInfoIndex((prevState) => (prevState + 1) % messages.length);
        setShow(true);
      }, 1000);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [messages.length, intervalDuration]);

  return (
    <Box component="span" display="flex" alignItems="center" gap={2}>
      <InfoIcon
        color={user!.accountType === "landlord" ? "primary" : "yellow"}
      />
      <Fade in={show} timeout={1000}>
        <Typography variant="body2" color="textSecondary">
          {messages[infoIndex]}
        </Typography>
      </Fade>
    </Box>
  );
};

export default AccountSettingsInfo;
