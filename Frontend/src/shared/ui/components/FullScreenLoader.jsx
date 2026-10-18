import { Loader2 } from "lucide-react";
import React from "react";

const FullScreenLoader = () => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white"
    >
      <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
      <Loader2 size={26} className="animate-spin text-[#0047AB]" />
    </div>
  );
};

export default FullScreenLoader;
