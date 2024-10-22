import axios from "axios";
import { createCheckoutSessionApi } from "../api/stripePaymentApi.ts";
import PaymentData from "../types/Payment.ts";

const createCheckoutSession = async (data: PaymentData) => {
  try {
    const response = await createCheckoutSessionApi(data);
    return response.data.clientSecret;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to create checkout session"
      );
    }
    throw new Error("Failed to create checkout session");
  }
};

export { createCheckoutSession };
