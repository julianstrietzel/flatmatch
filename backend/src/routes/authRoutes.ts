import express from "express";
import { signup, login, changePassword, confirmEmail, reAuth } from "../controllers/authController";
import { handleValidationErrors } from "../middleware/validation/handleValidationErrors";
import {
  signupValidation,
  loginValidation,
  changePasswordValidation,
} from "../middleware/validation/authValidation";
import authCheck from "../middleware/authCheck";

const router = express.Router();

router.post("/signup", signupValidation, handleValidationErrors, signup);

router.post("/login", loginValidation, handleValidationErrors, login);

router.post("/changePassword", authCheck, changePasswordValidation, handleValidationErrors, changePassword)

router.get('/confirm-email/:token', confirmEmail);

router.get("/reAuth", authCheck,  reAuth)

export default router;
