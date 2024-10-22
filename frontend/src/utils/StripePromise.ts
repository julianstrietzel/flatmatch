import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC = import.meta.env.VITE_STRIPE_PUBLIC;

if (!STRIPE_PUBLIC) {
  throw new Error("VITE_STRIPE_PUBLIC variable is required.");
}

const stripePromise = loadStripe(STRIPE_PUBLIC);

export default stripePromise;
