import { Box, Typography } from "@mui/material";

const ScrollInstructionOverlay = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 999,
        color: "white",
        pointerEvents: "none",
      }}
    >
      <Typography variant="h6">
        Hold the ⌘ key (Mac) or Ctrl key (Windows) to control the map
      </Typography>
    </Box>
  );
};

export default ScrollInstructionOverlay;
