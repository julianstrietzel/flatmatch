import {body, ValidationChain} from "express-validator";

export const accountValidation: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
]
