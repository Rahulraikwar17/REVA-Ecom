import React from "react";
import HeroBanner from "../components/HeroBanner";
import NewArrivals from "../components/NewArrivals";
import Features from "../components/Features";

const HomePage = () => {
  return (
    <div>
      <HeroBanner />
      <NewArrivals />
      <Features />
    </div>
  );
};

export default HomePage;
