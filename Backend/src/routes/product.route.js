import { Router } from "express";
import {
  authenticate,
  authenticateSeller,
} from "../middleware/auth.middleware.js";
import {
  allProductsController,
  createProduct,
  deleteProductController,
  editProductController,
  getProductDetailController,
  listAllProductToSeller,
  listProductController,
  productListingController,
  unlistProductController,
} from "../controller/product.controller.js";
import multer from "multer";
import {
  editProductValidator,
  getProductDetailValidator,
  listProductValidator,
  productDeleteValidator,
  productListingValidator,
  productValidator,
  unlistProductValidator,
} from "../validator/product.validator.js";
const router = Router();

const uplaod = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: 1 * 1024 * 1024,
  },
});
router.post(
  "/",
  authenticate,
  authenticateSeller,
  uplaod.array("images"),
  (req, res, next) => {
    req.body.price = JSON.parse(req.body.price);
    req.body.sizes = JSON.parse(req.body.sizes);

    console.log(req.body);

    next();
  },
  productValidator,
  createProduct,
);

router.get("/", authenticate, allProductsController);
router.get("/seller", authenticate, authenticateSeller, listAllProductToSeller);
router.patch(
  "/unlist/:id",
  authenticate,
  authenticateSeller,
  unlistProductValidator,
  unlistProductController,
);
router.patch(
  "/list/:id",
  authenticate,
  authenticateSeller,
  listProductValidator,
  listProductController,
);

router.patch(
  "/listing/:id",
  authenticate,
  authenticateSeller,
  productListingValidator,
  productListingController,
);

router.patch(
  "/edit-product/:id",
  authenticate,
  authenticateSeller,
  uplaod.array("images"),
  (req, res, next) => {
    try {
      if (typeof req.body.price === "string")
        req.body.price = JSON.parse(req.body.price);
      if (typeof req.body.sizes === "string")
        req.body.sizes = JSON.parse(req.body.sizes);
      next();
    } catch {
      res.status(400).json({ message: "price or sizes is not valid JSON" });
    }
  },
  editProductValidator,
  editProductController,
);

router.delete(
  "/product-delete/:id",
  authenticate,
  authenticateSeller,
  productDeleteValidator,
  deleteProductController,
);

router.get("/product-detail/:id",authenticate,getProductDetailValidator,getProductDetailController)
export default router;
