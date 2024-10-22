import { Box, Button, Typography } from "@mui/material";
import { IAd } from "../../types/Ad.ts";
import { Tag } from "../profiles/Tag.tsx";

interface AdContentProps {
  ad: IAd;
}

const AdContent = ({ ad }: AdContentProps) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={3}
      p={5}
      maxWidth="50%"
    >
      <img
        srcSet={ad.image}
        src={ad.image}
        alt={`${ad.title} image`}
        style={{
          width: "100%",
          height: "400px",
          objectFit: "contain",
        }}
      />
      <Typography>{ad.title}</Typography>
      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
        {ad.tags &&
          ad.tags.map((tag, index) => <Tag key={index} label={tag.tagKey} />)}
      </Box>
      <Button
        variant="contained"
        color="yellow"
        onClick={() => window.open(ad.url, "_blank")}
      >
        Visit Advertiser
      </Button>
      <Box pb={5}>
        <Typography variant="body1" align="center">
          {ad.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdContent;
