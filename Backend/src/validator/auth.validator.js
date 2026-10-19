import { body, validationResult } from "express-validator";

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

const emailRule = body("email")
  .exists()
  .withMessage("Email is required")
  .bail()
  .isString()
  .withMessage("Email must be a string")
  .bail()
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage("Enter a valid email address");

export const registerValidator = [
  emailRule,

  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .trim()
    .isLength({ min: 6, max: 72 })
    .withMessage("Password must be between 6 and 72 characters"),

  handleValidation,
];

export const loginValidator = [
  emailRule,

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Password is required"),

  handleValidation,
];