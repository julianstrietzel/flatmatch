import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { IFlatProfile } from "../../types/Profile.ts";
import { Tag } from "../profiles/Tag.tsx";

const Card = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  padding: 2,
  overflow: "hidden",
  border: `6px solid ${theme.palette.yellow.main}`,
}));

const ImageContainer = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "50%",
    background:
      "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(233, 186, 73, 0.6))",
  },
});

const Overlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "16px",
  boxSizing: "border-box",
});

const Title = styled(Typography)(() => ({
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
  textAlign: "left",
}));

interface SwipingCardProps {
  flatProfile: IFlatProfile | null;
}

const SwipingCard = ({ flatProfile }: SwipingCardProps) => {
  const maxTags = 4;

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box style={{ position: "relative", width: "300px", height: "400px" }}>
        <Card style={{ top: "15px", left: "15px", background: "#eee" }} />
        <Card style={{ background: "#d7d7d7" }} />
        <Card style={{ top: "-15px", left: "-15px" }}>
          <ImageContainer
            style={{ backgroundImage: `url(${flatProfile?.images[0]})` }}
          />
          <Overlay>
            <Box width="100%">
              <Title>{flatProfile?.name}</Title>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {flatProfile?.tags
                  .slice(0, maxTags)
                  .map((tag, index) => <Tag key={index} label={tag.tagKey} />)}
              </Box>
            </Box>
          </Overlay>
        </Card>
      </Box>
    </Box>
  );
};

export default SwipingCard;
