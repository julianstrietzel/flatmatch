import NoMoreFlats from "../../assets/no_more_flats_in_swiping.webp";
import { Box, Typography } from "@mui/material";

const SwipingMissingFlatsCard = () => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <img
        src={NoMoreFlats}
        alt="No flats to show currently"
        style={{
          width: "100%",
          height: "400px",
          borderRadius: "16px",
          objectFit: "cover",
        }}
      />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1">
          Currently there are no more flats to show.
        </Typography>
        <Typography>Please come back later</Typography>
      </Box>
    </Box>
  );
};

export default SwipingMissingFlatsCard;
