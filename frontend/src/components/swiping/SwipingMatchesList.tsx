import { Box, List, ListItemButton, Typography } from "@mui/material";
import SwipingMatchesListItem from "./SwipingMatchesListItem.tsx";
import { IFlatProfile } from "../../types/Profile.ts";
import { useState } from "react";
import FlatDetailsDialog from "../../pages/FlatDetailsDialog.tsx";

interface SwipingMatchesListProps {
  matches: IFlatProfile[];
}

const SwipingMatchesList = ({ matches }: SwipingMatchesListProps) => {
  const [selectedFlat, setSelectedFlat] = useState<string | null>(null);

  const handleFlatClick = (flatProfileId: string | null) => {
    setSelectedFlat(flatProfileId);
  };

  const handleClose = () => {
    setSelectedFlat(null);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={3}
    >
      <Typography variant="h5">Current Matches</Typography>
      <List style={{ width: "100%" }}>
        {matches.length > 0 ? (
          matches.map((match, index) => (
            <ListItemButton
              onClick={() => handleFlatClick(match._id)}
              key={match._id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <SwipingMatchesListItem
                key={index}
                imageUrl={match.images[0]}
                title={match.name}
                location={match.address}
              />
            </ListItemButton>
          ))
        ) : (
          <Typography variant="body1" align="center">
            You do not have any matches, yet.
          </Typography>
        )}
      </List>
      {selectedFlat && (
        <FlatDetailsDialog flatProfileId={selectedFlat} onClose={handleClose} />
      )}
    </Box>
  );
};

export default SwipingMatchesList;
