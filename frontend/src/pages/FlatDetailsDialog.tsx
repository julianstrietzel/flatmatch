import { useEffect, useState } from "react";
import { IFlatProfile } from "../types/Profile.ts";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { getFlatProfile } from "../services/profilesService.ts";
import { Tag } from "../components/profiles/Tag.tsx";
import CloseIcon from "@mui/icons-material/Close";
import MapWrapper from "../components/map/LeafLetMapComponent.tsx";

interface FlatDetailsDialogProps {
  flatProfileId: string;
  onClose: () => void;
}

const FlatDetailsDialog = ({
  flatProfileId,
  onClose,
}: FlatDetailsDialogProps) => {
  const [flatProfile, setFlatProfile] = useState<IFlatProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFlatDetails = async () => {
      try {
        setLoading(true);
        const response = await getFlatProfile(flatProfileId);
        setFlatProfile(response);
      } catch (error) {
        console.error(`Error fetching flat profile ${flatProfileId}`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlatDetails();
  }, [flatProfileId]);

  if (loading) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </Dialog>
    );
  }

  if (!flatProfile) {
    return null;
  }

  const { name, images, price, size, type, tags, description, address } =
    flatProfile;

  const formatType = ({ type }: { type: any }) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fullAddress = `${address.street} ${address.buildingNumber}, ${address.city}, ${address.postalCode}, ${address.state}, ${address.country}`;
  const { latitude, longitude } = address;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={3}
          width="100%"
        >
          <ImageList
            variant="quilted"
            rowHeight={200}
            gap={8}
            sx={{ width: "100%" }}
          >
            {images.map((image, index) => (
              <ImageListItem key={index}>
                <img
                  srcSet={image}
                  src={image}
                  alt={`Image ${index}`}
                  loading="lazy"
                  style={{ width: "100%" }}
                />
              </ImageListItem>
            ))}
          </ImageList>
          <Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            gap={3}
            width="100%"
          >
            <Typography>Price: {price} &euro;/month</Typography>
            <Typography>Size: {size} m&sup2;</Typography>
            <Typography>Type: {formatType({ type: type })}</Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            flexWrap="wrap"
            gap={1}
            width="100%"
          >
            {tags &&
              tags.map((tag, index) => <Tag key={index} label={tag.tagKey} />)}
          </Box>
          <Box pb={5} width="100%">
            <Typography variant="body1">{description}</Typography>
          </Box>
          {latitude && longitude && (
            <Box width="100%">
              <Typography variant="h6">Map</Typography>
              <Typography>{fullAddress}</Typography>
              <MapWrapper
                address={fullAddress}
                lat={latitude}
                lon={longitude}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FlatDetailsDialog;
