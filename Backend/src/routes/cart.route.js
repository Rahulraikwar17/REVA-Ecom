import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  addToCartValidator,
  removeCartItemValidator,
  updateCartItemValidator,
} from "../validator/cart.validator.js";
import {
  addToCartController,
  getCartController,
  removeCartController,
  removeCartItemController,
  updateCartItemController,
} from "../controller/cart.controller.js";

const router = Router();

router.post("/", authenticate, addToCartValidator, addToCartController);
router.get("/", authenticate, getCartController);
router.patch(
  "/:itemId",
  authenticate,
  updateCartItemValidator,
  updateCartItemController,
);
router.delete(
  "/:itemId",
  authenticate,
  removeCartItemValidator,
  removeCartItemController,
);
router.delete("/", authenticate,removeCartController);
export default router;
