import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { setPremiumUser } from "./accountController";

dotenv.config();

const STRIPE_KEY: string | undefined = process.env.STRIPE_SECRET;
const FRONTEND_URL: string | undefined =
  process.env.FRONTEND_URL || "http://localhost:5173";

// TODO: change to external webhook if deployed publicly
const endpointSecret: string =
  "whsec_6ee16fb4774947612807659a4e212b359baf745c1a0b5f55f488c2cae4264497";

if (!STRIPE_KEY) {
  console.error("Missing environment variable STRIPE_SECRET. Exiting...");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_KEY || "");

const createStripeSession = async (req: Request, res: Response) => {
  const { userId, type } = req.body;

  if (!type || !userId) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid request" });
  }

  const productMap: Record<string, string> = {
    monthly: "price_1PWkKkEjGnVHm0NfLHQFjaSL",
    annually: "price_1PWkLLEjGnVHm0NfoQHut0Ii",
  };

  const product = productMap[type];

  if (!product) {
    return res
      .status(404)
      .json({ error: "Not Found", message: "Product not found" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: product,
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      metadata: {
        type: type,
      },
      mode: "payment",
      ui_mode: "embedded",
      return_url: FRONTEND_URL + `/payment-result`,
    });

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    console.error(`Error creating checkout session ${error}`);
  }
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession: Stripe.Checkout.Session = event.data.object;
      console.log("SESSION", checkoutSession);

      const userId = checkoutSession.client_reference_id;
      const type = checkoutSession.metadata?.type;

      if (userId && type) {
        await setPremiumUser(userId, type);
      } else {
        console.error("Error fetching user details from checkout session");
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.send(200);
};

export { createStripeSession, stripeWebhookHandler };
