import { useCallback } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import stripePromise from "../utils/StripePromise.ts";
import { createCheckoutSession } from "../services/stripePaymentService.ts";
import PaymentData from "../types/Payment.ts";
import { useAuth } from "../hooks/useAuth.ts";

interface StripeEmbeddedCheckoutProps {
  type: string;
}

const CheckoutStripeEmbedded = ({ type }: StripeEmbeddedCheckoutProps) => {
  const { user } = useAuth();

  const fetchClientSecret = useCallback(async () => {
    if (user == null || user.id == null) {
      return;
    }

    const paymentData: PaymentData = {
      userId: user.id,
      type: type,
    };

    try {
      return await createCheckoutSession(paymentData);
    } catch (error) {
      console.error(`Error creating checkout session: ${error}`);
    }
  }, [user, type]);

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
};

export default CheckoutStripeEmbedded;
