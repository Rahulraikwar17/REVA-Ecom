import React from "react";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <img src="/logo.png" alt="Logo" className="mb-10 h-10 w-auto" />
      <p className="text-7xl font-bold text-[#0047AB]">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-black">Page not found</h1>
      <p className="mt-2 max-w-sm text-neutral-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/home"
        className="mt-8 rounded-md bg-[#0047AB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2"
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFoundPage;