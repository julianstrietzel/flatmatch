import { Box, Button } from "@mui/material";
import theme from "../../theme.ts";
import left_vector from "../../assets/left_vector.svg";
import right_vector from "../../assets/right_vector.svg";
import { ReactNode } from "react";

interface swipingButtonProps {
  icon: ReactNode;
  text: string;
  handleClick: () => void;
}
export const SwipingButton = ({
  icon,
  text,
  handleClick,
}: swipingButtonProps) => {
  const vector_url = text === "Dislike" ? left_vector : right_vector;
  const backgroundPosition = text === "Dislike" ? "left" : "right";
  return (
    <Box
      display={"flex"}
      width={"15%"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        background: `url(${vector_url})`,
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "center",
        backgroundPositionX: backgroundPosition,
        backgroundSize: "contain",
      }}
    >
      <Button
        variant="contained"
        startIcon={icon}
        sx={{ margin: "30px", bgcolor: theme.palette.yellow.main }}
        onClick={handleClick}
      >
        {text}
      </Button>
    </Box>
  );
};
