import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth.ts";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
}: ConfirmationDialogProps) => {
  const { user } = useAuth();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color={user!.accountType === "landlord" ? "primary" : "yellow"}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color={user!.accountType === "landlord" ? "primary" : "yellow"}
          onClick={onConfirm}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
