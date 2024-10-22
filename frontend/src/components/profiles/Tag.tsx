import { styled } from "@mui/system";
import { Chip } from "@mui/material";

export const Tag = styled(Chip)(({ theme }) => ({
  color: "#fff",
  backgroundColor: theme.palette.yellow.main,
  fontWeight: "bold",
}));
