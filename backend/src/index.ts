import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import * as http from "node:http";
import accountRouter from "./routes/accountRouter";
import matchingRouter from "./routes/matchingRouter";
import chat_router from "./routes/chatRouter";
import authRoutes from "./routes/authRoutes";
import stripePaymentsRouter from "./routes/stripePaymentsRouter";
import { socketIoSetup } from "./sockets/chatSocket";
import flatProfileRouter from "./routes/flatProfileRouter";
import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import contactRouter from "./routes/contactRouter";
import adRouter from "./routes/adRouter";
import searchProfileRouter from "./routes/searchProfileRouter";

dotenv.config();

const PORT: string | undefined = process.env.PORT;
const MONGODB_URL: string | undefined = process.env.MONGODB_URL;
const USERNAME: string | undefined = process.env.USERNAME;
const PASSWORD: string | undefined = process.env.PASSWORD;

if (!PORT || !MONGODB_URL || !USERNAME || !PASSWORD) {
  console.error(
    "Missing environment variables (PORT, MONGODB_URL, USERNAME or PASSWORD): Exiting..."
  );
  process.exit(1);
}

const app: Express = express();
const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
socketIoSetup(io);

// Middleware
app.use(cors());
app.use((req, res, next) => {
  // Exclude Stripe webhook path -> need to use raw body
  if (req.path === "/api/v1/payments/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// General API router
const apiRouter = express.Router();
app.use("/api", apiRouter);

// Routes
apiRouter.use("/v1/chats", chat_router);
apiRouter.use("/v1/accounts", accountRouter);
apiRouter.use("/v1/auth", authRoutes);
apiRouter.use("/v1/matches", matchingRouter);
apiRouter.use("/v1/flat-profiles", flatProfileRouter);
apiRouter.use("/v1/search", flatProfileRouter);
apiRouter.use("/v1/payments/stripe", stripePaymentsRouter);
apiRouter.use("/v1/search-profiles", searchProfileRouter);
apiRouter.use("/v1/contact", contactRouter);
apiRouter.use("/v1/ads", adRouter);

// Basic welcome route
apiRouter.use("/", (req, res) => {
  res.send("Welcome to FlatMatchAPI");
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(MONGODB_URL, {
    user: USERNAME,
    pass: PASSWORD,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(parseInt(PORT), "0.0.0.0", () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use((err: Error, req: express.Request, res: express.Response) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      error: "Multer Error",
      message: err.message,
    });
  }
  console.error("Error in the server:", err);
  res.status(500).send("Server error");
});

// Unhandled exception handler
process.on("uncaughtException", (err: Error) => {
  console.error("Unhandled exception:", err);
  process.exit(1);
});

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
});
