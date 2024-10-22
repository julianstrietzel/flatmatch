import apiClient from "./apiClient.ts";
import PaymentData from "../types/Payment.ts";

const createCheckoutSessionApi = (data: PaymentData) =>
  apiClient.post(`/v1/payments/stripe/create-checkout-session`, data);

export { createCheckoutSessionApi };
