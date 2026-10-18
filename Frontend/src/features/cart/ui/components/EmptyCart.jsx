import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";

function EmptyCart() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="cart-rise relative flex h-28 w-28 items-center justify-center rounded-full border border-neutral-300">
        <ShoppingBag size={44} strokeWidth={1.5} className="text-black" />
        <span className="absolute right-2 top-2 h-3.5 w-3.5 rounded-full bg-[#0047AB] ring-4 ring-white" />
      </div>

      <h2
        style={{ animationDelay: "100ms" }}
        className="cart-rise mt-8 text-3xl font-bold tracking-tight text-black"
      >
        Your cart is empty
      </h2>

      <p
        style={{ animationDelay: "180ms" }}
        className="cart-rise mt-3 max-w-sm text-neutral-500"
      >
        You have not added anything yet. Explore our latest styles and find
        something you love.
      </p>

      <Link
        to="/products"
        style={{ animationDelay: "260ms" }}
        className="cart-rise mt-8 inline-flex items-center rounded-xl bg-black px-8 py-3.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#0047AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2"
      >
        Explore products
      </Link>
    </div>
  );
}

export default EmptyCart;