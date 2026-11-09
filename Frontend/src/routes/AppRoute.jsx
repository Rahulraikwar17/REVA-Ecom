import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router";

import HomePage from "../shared/ui/pages/HomePage.jsx";
import AboutPage from "../shared/ui/pages/AboutPage.jsx";
import ProductPage from "../features/product/ui/pages/ProductPage.jsx";
import ProductDetailPage from "../features/product/ui/pages/ProductDetailPage.jsx";
import CartPage from "../features/cart/ui/pages/CartPage.jsx";

import LoginPage from "../features/auth/ui/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/ui/pages/RegisterPage.jsx";

import SellerProductPage from "../features/product/ui/pages/SellerProductPage.jsx";
import AddProductPage from "../features/product/ui/pages/AddProductPage.jsx";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import SellerRoute from "./SellerRoute";

import AuthLayout from "../app/layouts/AuthLayout.jsx";
import MainLayout from "../app/layouts/MainLayout.jsx";

import { useCurrentUser } from "../features/auth/hook/useAuth.jsx";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "products",
        element: <ProductPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <SellerRoute />,
            children: [
              {
                path: "seller/products",
                element: <SellerProductPage />,
              },
              {
                path: "seller/products/new",
                element: <AddProductPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const AppRoute = () => {
  const { fetchingUser } = useCurrentUser();

  if (fetchingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-black" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default AppRoute;