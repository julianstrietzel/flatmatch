import { Box, Typography, ImageList, ImageListItem } from "@mui/material";
import no_more_flats_in_swiping from "../../assets/no_more_flats_in_swiping.webp";
import { IFlatProfile } from "../../types/Profile.ts";
import { Tag } from "../profiles/Tag.tsx";
import MapWrapper from "../map/LeafLetMapComponent.tsx";

interface MainContentProps {
  loading: boolean;
  flatProfile?: IFlatProfile;
}

const MainContent: React.FC<MainContentProps> = ({ loading, flatProfile }) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  if (!flatProfile) {
    return (
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <img
          src={no_more_flats_in_swiping}
          alt="No more flats to show"
          style={{
            maxWidth: "100%",
            height: "auto",
            maxHeight: "50vh",
          }}
        />
        <Typography>No more flats to show... Come back later.</Typography>
      </Box>
    );
  }
  const { address } = flatProfile;
  const fullAddress = `${address.street} ${address.buildingNumber}, ${address.city}, ${address.postalCode}, ${address.state}, ${address.country}`;
  const { latitude, longitude } = address;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={3}
      sx={{
        height: "fit-content",
      }}
    >
      <Typography variant="h4">{flatProfile!.name}</Typography>
      {flatProfile!.images && (
        <ImageList cols={3} rowHeight={400} gap={16}>
          {flatProfile!.images.map((image, index) => (
            <ImageListItem key={index}>
              <img
                srcSet={image}
                src={image}
                alt={`Image ${index}`}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        gap={3}
      >
        <Typography sx={{ fontWeight: "bold" }}>
          Price: {flatProfile!.price} &euro;/month
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Size: {flatProfile!.size} m&sup2;
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Type:{" "}
          {(flatProfile!.type || "Shared Flat").charAt(0).toUpperCase() +
            (flatProfile!.type || "Shared Flat").slice(1).replace("_", " ")}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
        {flatProfile!.tags &&
          flatProfile!.tags.map((tag, index) => (
            <Tag key={index} label={tag.tagKey} />
          ))}
      </Box>
      <Box pb={5}>
        <Typography variant="body1">{flatProfile!.description}</Typography>
      </Box>
      {latitude && longitude && (
        <Box width="100%">
          <Typography variant="h6">Map</Typography>
          <Typography>{fullAddress}</Typography>
          <MapWrapper address={fullAddress} lat={latitude} lon={longitude} />
        </Box>
      )}
    </Box>
  );
};

export default MainContent;
