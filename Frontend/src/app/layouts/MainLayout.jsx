import React from "react";
import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "../../shared/ui/components/Navbar";
import Footer from "../../shared/ui/components/Footer";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </div>
  );
};

export default MainLayout;
