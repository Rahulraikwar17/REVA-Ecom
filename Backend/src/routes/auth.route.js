import { Router } from "express";
import {
  getMeController,
  loginController,
  logoutController,
  refreshController,
  registerController,
} from "../controller/auth.controller.js";
import {
  loginValidator,
  registerValidator,
} from "../validator/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerValidator, registerController);
router.post("/login", loginValidator, loginController);

router.post("/refresh", refreshController);

router.get("/me", authenticate, getMeController);
router.post("/logout", authenticate,logoutController);
export default router;
