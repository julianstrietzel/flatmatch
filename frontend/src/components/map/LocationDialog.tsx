import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import MapWrapper from "./LeafLetMapComponent";
import AutocompleteInput from "./AutoCompleteInput";

interface Suggestion {
  formatted: string;
  lat: number;
  lon: number;
}

function LocationDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Show Apartment Location
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Apartment Location</DialogTitle>
        <DialogContent>
          <AutocompleteInput onSelect={setSelectedSuggestion} />
          {selectedSuggestion && (
            <MapWrapper
              address={selectedSuggestion.formatted}
              lat={selectedSuggestion.lat}
              lon={selectedSuggestion.lon}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LocationDialog;
