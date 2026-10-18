import express from "express";
import authRoutes from "../routes/auth.route.js";
import productRoutes from "../routes/product.route.js";
import cartRoutes from "../routes/cart.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://reva-ecom.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

export default app;
