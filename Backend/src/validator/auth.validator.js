import { body, validationResult } from "express-validator";

export const registerValidator = [
  body("email")
    .trim()
    .exists()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Enter valid email address"),
  body("name")
    .exists()
    .withMessage("name is required")
    .bail()
    .isString()
    .withMessage("Name must be string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be 2 to 50"),
  body("password")
    .exists()
    .withMessage("password is required")
    .bail()
    .isString()
    .withMessage("password must be a string")
    .trim()
    .isLength({ min: 6 })
    .withMessage("password at least 6 charaacter long "),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        Message: "Invalid request",
        errors: errors.array(),
      });
    }

    next();
  },
];

export const loginValidator = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()
    .trim()
    .isString()
    .withMessage("Email must be a String value")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .trim()
    .isString()
    .withMessage("password must be a string")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password at least 6 charaacter long "),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        Message: "Invalid Data",
        errors: errors.array(),
      });
    }

    next();
  },
];
