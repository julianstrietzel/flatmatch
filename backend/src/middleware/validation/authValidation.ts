import { body, ValidationChain } from "express-validator";

// Defines validation chains, meaning the validation rules that will be applied to the request body
// The results are then passed to the handleValidationErrors middleware
export const signupValidation: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("accountType")
    .isIn(["tenant", "landlord"])
    .withMessage("Invalid account type"),
];

export const loginValidation: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const changePasswordValidation: ValidationChain[] = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword").notEmpty().withMessage("New password is required"),
]
