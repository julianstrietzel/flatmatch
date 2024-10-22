import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface DiscardConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}

function DiscardConfirmationDialog({
  open,
  onClose,
  onConfirm,
  name,
}: DiscardConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{"Confirm Discard"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to discard {name}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="outlined"
          color="neutral"
          autoFocus
        >
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DiscardConfirmationDialog;
