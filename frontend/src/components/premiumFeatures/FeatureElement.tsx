import { ListItem, ListItemIcon, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface FeatureElementProps {
  text: string;
  premiumFeature: boolean;
}

export const FeatureElement = ({
  text,
  premiumFeature,
}: FeatureElementProps) => {
  return (
    <ListItem>
      <ListItemIcon>
        <CheckIcon />
      </ListItemIcon>
      <Typography
        variant="body2"
        style={{ fontWeight: premiumFeature ? "bold" : "normal" }}
      >
        {text}
      </Typography>
    </ListItem>
  );
};

export default FeatureElement;
