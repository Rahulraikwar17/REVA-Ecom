import { createBrowserRouter, RouterProvider } from "react-router";

import { useCurrentUser } from "../features/auth/hook/useAuth";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import SellerRoute from "./SellerRoute";

import AuthLayout from "../app/layouts/AuthLayout";
import MainLayout from "../app/layouts/MainLayout";
import Cartpage from "../features/cart/ui/pages/CartPage";
import LoginPage from "../features/auth/ui/pages/LoginPage";
import RegisterPage from "../features/auth/ui/pages/RegisterPage";
import HomePage from "../shared/ui/pages/HomePage";
import AboutPage from "../shared/ui/pages/AboutPage";
import ProductPage from "../features/product/ui/pages/ProductPage";
import AddProductPage from "../features/product/ui/pages/AddProductPage";
import SellerProductPage from "../features/product/ui/pages/SellerProductPage";
import FullScreenLoader from "../shared/ui/components/FullScreenLoader";
import NotFoundPage from "../shared/ui/components/NotFoundPage";
import ProductDetailPage from "../features/product/ui/pages/ProductDetailPage";

// Created outside the component so it does not reset on re-render
const router = createBrowserRouter([
  // Public routes (login, register)
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        path: "",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
    ],
  },

  // Private routes (logged-in users)
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "cart", element: <Cartpage /> },
          { path: "about", element: <AboutPage /> },
          { path: "products", element: <ProductPage /> },
          { path: "products/:id", element: <ProductDetailPage /> },

          // Seller-only routes (inside the same layout, so the navbar stays)
          {
            path: "seller/products",
            element: <SellerRoute />,
            children: [
              { path: "", element: <SellerProductPage /> },
              { path: "new", element: <AddProductPage /> },
            ],
          },
        ],
      },
    ],
  },

  // Anything else
  { path: "*", element: <NotFoundPage /> },
]);

const AppRoute = () => {
  // On reload, restore the user from the token
  const { fetchingUser } = useCurrentUser();

  if (fetchingUser) return <FullScreenLoader />;

  return <RouterProvider router={router} />;
};

export default AppRoute;
