import { Router } from "express";
import authCheck from "../middleware/authCheck";
import { getAd } from "../controllers/adController";

const adRouter: Router = Router();

adRouter
  .route("/:adId")
  .get(authCheck, getAd);

export default adRouter;
