import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMemo, useState } from "react";
import StripeEmbeddedCheckout from "./StripeEmbeddedCheckout.tsx";

interface PaymentPreviewProps {
  open: boolean;
  monthly: boolean;
  close: () => void;
}

const PaymentPreviewDialog = ({
  open,
  monthly,
  close,
}: PaymentPreviewProps) => {
  const [view, setView] = useState<"overview" | "stripe">("overview");

  const handleStripeClick = () => {
    setView("stripe");
  };

  const handleBackClick = () => {
    setView("overview");
  };

  const exipryDate = useMemo(() => {
    const date = new Date();
    if (monthly) {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setMonth(date.getMonth() + 12);
    }
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [monthly]);

  return (
    <Dialog open={open} onClose={close}>
      <IconButton
        onClick={close}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      {view == "overview" ? (
        <>
          <DialogTitle variant="h5" sx={{ textAlign: "center", paddingTop: 5 }}>
            Do you want to checkout?
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              marginTop: 3,
            }}
          >
            <DialogContentText>
              <Button
                variant="contained"
                color="neutral"
                onClick={handleStripeClick}
              >
                Pay with
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                  alt="Stripe"
                  style={{ height: 20, marginLeft: 5 }}
                />
              </Button>
            </DialogContentText>
            <DialogContentText>
              Your subscription will be valid until {exipryDate}
            </DialogContentText>
          </DialogContent>
        </>
      ) : (
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            marginTop: 3,
          }}
        >
          <Button
            variant="text"
            onClick={handleBackClick}
            sx={{ position: "absolute", top: 8, left: 8 }}
          >
            <ArrowBackIcon />
            Back to Checkout Overview
          </Button>
          <StripeEmbeddedCheckout type={monthly ? "monthly" : "annually"} />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default PaymentPreviewDialog;
