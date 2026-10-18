import { body, param, validationResult } from "express-validator";

export const addToCartValidator = [
  body("productId")
    .exists()
    .withMessage("product ID is required")
    .bail()
    .isString()
    .withMessage("product ID must be a string")
    .bail()
    .isMongoId()
    .withMessage("product ID must be a valid Mongo ID"),

  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("quantity must be a intiger greater than 0")
    .toInt(),
  body("size")
    .exists()
    .withMessage("Size is required")
    .bail()
    .isString()
    .withMessage("sie must be a string")
    .bail()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("size must be one of XS,S,M,L,XL,XXL"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "validation failed",
        errors: errors.array(),
      });
    }

    next();
  },
];

export const updateCartItemValidator = [
  param("itemId").isMongoId().withMessage("item ID must be a valid Mongo ID"),

  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("quantity must be an integer greater than 0")
    .toInt(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

export const removeCartItemValidator = [
  param("itemId").isMongoId().withMessage("item ID must be a valid Mongo ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];
