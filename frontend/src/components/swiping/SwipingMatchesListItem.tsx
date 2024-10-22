import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/system";
import { IAddress } from "../../types/Profile.ts";

const StyledListItem = styled(ListItem)({
  transition: "transform 0.3s, box-shadow 0.3s",
  borderRadius: "8px",
  overflow: "hidden",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  },
});

const formatAddress = (address: IAddress) =>
  `${address.postalCode}, ${address.city}`;

interface SwipingMatchesListItemProps {
  imageUrl: string;
  title: string;
  location: IAddress;
}

const SwipingMatchesListItem = ({
  imageUrl,
  title,
  location,
}: SwipingMatchesListItemProps) => {
  return (
    <StyledListItem>
      <Box display="flex" gap={2}>
        <Box display="flex" alignContent="center">
          <ListItemAvatar>
            <Avatar style={{ width: 64, height: 64 }}>
              <img
                src={imageUrl}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Avatar>
          </ListItemAvatar>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <ListItemText
            primary={title}
            secondary={formatAddress(location)}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          />
        </Box>
      </Box>
    </StyledListItem>
  );
};

export default SwipingMatchesListItem;
