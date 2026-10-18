import { body, param, validationResult } from "express-validator";

export const productValidator = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a String")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title length must be 2 to 100 characters")
    .bail()
    .matches(/^[A-Za-z0-9 \-&'().,]+$/)
    .withMessage(
      "Title can only have letters, numbers, spaces and - & ' ( ) . ,",
    ),
  body("description")
    .exists()
    .withMessage("description is required")
    .bail()
    .isString()
    .withMessage("description must be a string ")
    .bail()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage("descrition length must be between 20 to 500 characters"),
  body("price.amount")
    .exists()
    .withMessage("price amount is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price amount must be a flotting number and must be 0"),
  body("price.currency")
    .exists()
    .withMessage("currency is required")
    .bail()
    .isString()
    .withMessage("curency must be a string")
    .bail()
    .isIn(["INR", "USD"])
    .withMessage("currency either be INR or USD"),

  body("sizes")
    .exists()
    .withMessage("sizes are required")
    .bail()
    .isArray()
    .withMessage("sizes must be an array of object"),
  body("sizes.*.size")
    .exists()
    .withMessage("size must be present inn every entry of sizes array")
    .bail()
    .isString()
    .withMessage("size must be a string value")
    .bail()
    .trim()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("size can be on eof these XS,S,M,L,XL,XXL"),

  body("sizes.*.stock")
    .exists()
    .withMessage("stock must be present of every entry of the sizes array ")
    .bail()
    .isInt({ min: 0 })
    .withMessage("stock must be a integer value and above 0"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid Request",
        errors: errors.array(),
      });
    }

    next();
  },
];

export const unlistProductValidator = [
  param("id")
    .exists()
    .withMessage("product id required in request param")
    .bail()
    .isMongoId()
    .withMessage("product is must be a valid mongo object id"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid data",
        errors: errors.array(),
      });
    }

    next();
  },
];
export const listProductValidator = [
  param("id")
    .exists()
    .withMessage("product id required in request param")
    .bail()
    .isMongoId()
    .withMessage("product is must be a valid mongo object id"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid data",
        errors: errors.array(),
      });
    }

    next();
  },
];

export const productListingValidator = [
  param("id").isMongoId().withMessage("Product ID must be a valid Mongo ID"),

  body("published")
    .exists()
    .withMessage("Published value is required")
    .bail()
    .custom((value) => typeof value === "boolean")
    .withMessage("Published value must be a boolean (true or false)"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    next();
  },
];

export const productDeleteValidator = [
  param("id")
    .exists()
    .withMessage("product id required in request param")
    .bail()
    .isMongoId()
    .withMessage("product is must be a valid mongo object id"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid data",
        errors: errors.array(),
      });
    }

    next();
  },
];

export const editProductValidator = [
  param("id").isMongoId().withMessage("Product ID must be a valid Mongo ID"),
  ...productValidator,
];

export const getProductDetailValidator = [
  param("id")
    .exists()
    .withMessage("product id required in request param")
    .bail()
    .isMongoId()
    .withMessage("product is must be a valid mongo object id"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid data",
        errors: errors.array(),
      });
    }

    next();
  },
];
