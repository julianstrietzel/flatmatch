import { Router } from "express";
import {
  createFlatProfile,
  editFlatProfile,
  getAddress,
  getFlatProfile,
  uploadImages,
} from "../controllers/flatProfileController";
import upload from "../config/multer";
import authCheck from "../middleware/authCheck";
import checkLandlordRole from "../middleware/checkLandlordRole";

class FlatProfileRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes() {
    this.router.use(authCheck);

    // Route to create a new flat profile
    this.router.post("", checkLandlordRole, createFlatProfile);

    // Route to upload images to flat prfoile
    this.router.post("/upload", upload.array("images", 10), uploadImages);

    // Route to get a flat profile with the given id
    this.router.get("/:flatProfileId", getFlatProfile);

    // Route to edit a flat profile with the given id and landlord role check
    this.router.patch("/:flatProfileId", editFlatProfile);

    // Address search api route
    this.router.get("/search", getAddress);
  }
}

export default new FlatProfileRouter().router;
