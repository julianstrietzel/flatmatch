import { Router } from "express";
import {
  deleteAccount,
  deleteDocument,
  deleteProfilePicture,
  editAccount,
  getAccount,
  getLimitedAccount,
  uploadDocument,
  uploadProfilePicture,
} from "../controllers/accountController";
import authCheck from "../middleware/authCheck";
import upload from "../config/multer";
import { accountValidation } from "../middleware/validation/accountValidation";
import { handleValidationErrors } from "../middleware/validation/handleValidationErrors";
import checkTenantRole from "../middleware/checkTenantRole";
import checkPremiumUser from "../middleware/checkPremiumUser";

const accountRouter: Router = Router();

accountRouter
  .route("/:accountId")
  .get(authCheck, getAccount)
  .patch(authCheck, accountValidation, handleValidationErrors, editAccount)
  .delete(authCheck, deleteAccount);

accountRouter.route("/:accountId/limited").get(authCheck, getLimitedAccount);

accountRouter
  .route("/:accountId/profilePicture")
  .post(authCheck, upload.single("profilePicture"), uploadProfilePicture)
  .delete(authCheck, deleteProfilePicture);

accountRouter
  .route("/:accountId/documents")
  .post(authCheck, checkPremiumUser, checkTenantRole, upload.single("document"), uploadDocument);

accountRouter
  .route("/:accountId/documents/:documentId")
  .delete(authCheck, checkPremiumUser, checkTenantRole, deleteDocument);

export default accountRouter;
