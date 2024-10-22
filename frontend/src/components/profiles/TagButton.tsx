import { Box, IconButton, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

interface TagButtonProps {
  label: string;
  onButton: () => void;
  onClick: () => void;
  backgroundColor: string;
  color: string;
}

const TagButton = ({
  label,
  onButton,
  onClick,
  backgroundColor,
  color,
}: TagButtonProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      pl={2}
      pr={1}
      py={0.5}
      borderRadius={16}
      style={{
        backgroundColor: backgroundColor,
        cursor: "pointer",
        color: color,
      }}
      onClick={onClick}
    >
      <Typography variant="body2" sx={{ marginRight: 1 }}>
        {label}
      </Typography>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onButton();
        }}
        style={{ color: "white" }}
      >
        <CancelIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default TagButton;
