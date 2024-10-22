import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Middleware to handle validation errors, by extracting them from the request object
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};