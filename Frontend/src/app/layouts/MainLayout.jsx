import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../shared/ui/components/Navbar";
import Footer from "../../shared/ui/components/Footer";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
