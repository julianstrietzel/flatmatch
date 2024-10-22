import { Router } from "express";
import authCheck from "../middleware/authCheck";
import matchingController, {
  MatchingController,
} from "../controllers/matchingController";

class MatchingRouter {
  router = Router();
  matchingController: MatchingController;

  constructor() {
    this.matchingController = matchingController;
    this.matchingController
      .initialize()
      .then(() => console.log("MatchingController initialized"));
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authCheck);
    // Get paginated list of most promising flats for a tenant filtered for already liked/disliked flats
    this.router.get(
      "/promising/flatProfiles/:searchProfileId",
      this.matchingController.getPromisingFlats.bind(this.matchingController)
    );

    // Get paginated list of most promising tenants for a flat filtered for disapproved tenants and split by approved and not approved
    this.router.get(
      "/promising/searchProfiles/:flatProfileId",
      this.matchingController.getPromisingTenants.bind(this.matchingController)
    );

    // Like/dislike a flat
    this.router.put(
      "/tenants/:searchProfileId/likes/:flatProfileId",
      this.matchingController.likeFlat.bind(this.matchingController)
    );

    this.router.put(
      "/tenants/:searchProfileId/dislikes/:flatProfileId",
      this.matchingController.dislikeFlat.bind(this.matchingController)
    );

    // Approve/disapprove a tenant
    this.router.put(
      "/landlords/:flatProfileId/approvals/:searchProfileId",
      this.matchingController.approveTenant.bind(this.matchingController)
    );
    this.router.put(
      "/landlords/:flatProfileId/disapprovals/:searchProfileId",
      this.matchingController.disapproveTenant.bind(this.matchingController)
    );

    // Get approved tenants
    this.router.get(
      "/landlords/:flatProfileId/approvals",
      this.matchingController.getApprovedTenants.bind(this.matchingController)
    );
  }
}

export default new MatchingRouter().router;
