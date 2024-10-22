import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import empty_user_pool from "../../assets/empty_user_pool.svg";
import { AccessTime } from "@mui/icons-material";

const EmptyPoolContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "20px",
  position: "relative",
  width: "100%",
  height: "100%",
}));

const TextContainer = styled(Box)(() => ({
  maxWidth: "1200px",
  width: "100%",
}));

const ClockIconContainer = styled(Box)(() => ({
  position: "absolute",
  bottom: "0px",
  right: "0px",
  display: "flex",
  alignItems: "center",
  fontSize: "1rem",
  padding: "5px 10px",
}));

function EmptyUserPool() {
  const theme = useTheme();

  return (
    <EmptyPoolContainer>
      <img
        src={empty_user_pool}
        alt="Empty user pool"
        style={{
          maxWidth: "100%",
          height: "auto",
          maxHeight: "50vh",
        }}
      />
      <TextContainer>
        <Typography variant="h3" gutterBottom>
          Wait until we find the{" "}
          <span style={{ color: theme.palette.blue[500] }}>perfect match!</span>
        </Typography>
        <Typography color={"neutral.700"} variant="h5">
          Our <strong>algorithm</strong> is now doing its best to find the
          perfect match for you by giving potential roommates time to see your
          listing and express their interest.
        </Typography>
        <Typography color={"neutral.700"} variant="h5" sx={{ mt: 2 }}>
          Thank you for your <strong>trust!</strong>
        </Typography>
      </TextContainer>
      <ClockIconContainer>
        <AccessTime color="yellow" />
        <Typography variant="body2" sx={{ ml: 1 }}>
          Check back soon!
        </Typography>
      </ClockIconContainer>
    </EmptyPoolContainer>
  );
}

export default EmptyUserPool;
