import express from "express";
import { createStripeSession, stripeWebhookHandler } from "../controllers/stripePaymentController";

const stripePaymentsRouter = express.Router();

stripePaymentsRouter
  .post("/create-checkout-session", createStripeSession)
  .post("/webhook", express.raw({type: "application/json"}), stripeWebhookHandler)

export default stripePaymentsRouter;