import { Router } from "express";
import authCheck from "../middleware/authCheck";
import {
  createSearchProfile,
  editSearchProfile,
  getSearchProfile,
} from "../controllers/searchProfileController";

class SearchProfileRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes() {
    this.router.use(authCheck);

    // Route to create a new flat profile
    this.router.post("", createSearchProfile);

    // Route to edit a flat profile with the given id
    this.router.patch("/:searchProfileId", editSearchProfile);

    // Depending on the request, either get all search profiles for one account or a specific one
    this.router.get("", getSearchProfile);

    this.router.get("/:searchProfileId", getSearchProfile);
  }
}

export default new SearchProfileRouter().router;
