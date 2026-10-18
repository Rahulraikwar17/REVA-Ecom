import React from "react";
import { Truck, RotateCcw, Banknote, Shirt } from "lucide-react";

const FEATURES = [
  { icon: Truck, title: "Free delivery", text: "On orders above ₹999" },
  { icon: RotateCcw, title: "Easy returns", text: "7-day hassle-free returns" },
  { icon: Banknote, title: "Cash on delivery", text: "Pay when it arrives" },
  { icon: Shirt, title: "Quality fabric", text: "Soft, durable cotton" },
];

const Features = () => {
  return (
    <section className="border-y border-black/10 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#0047AB]/10 text-[#0047AB] ring-1 ring-[#0047AB]/20">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-black">{title}</h3>
            <p className="mt-1 text-xs text-neutral-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;