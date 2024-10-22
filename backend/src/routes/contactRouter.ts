import { Router } from "express";
import { sendContactEmail } from "../controllers/contactController";

class ContactRoutes {
  public router = Router();

  constructor() {
    this.router.post("", sendContactEmail);
  }
}

export default new ContactRoutes().router;
