import React, { useState } from "react";
import { Link } from "react-router";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import useCart from "../../../cart/hook/useCart";

const formatPrice = ({ amount, currency }) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const ProductCard = ({ product }) => {
  const { _id, title, images = [], price, sizes = [] } = product;

  const { addToCart, isAddingToCart } = useCart();

  const mainImage = images[0];
  const hoverImage = images[1];
  const [imgFailed, setImgFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);

  const soldOut = sizes.length > 0 && sizes.every((s) => s.stock === 0);

  const detailPath = `/products/${_id}`;

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (sizes.length > 0 && !selectedSize) {
      setMessage("Please select a size");
      return;
    }

    setMessage("");

    addToCart(
      { productId: _id, size: selectedSize, quantity: 1 },
      {
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        },
        onError: (err) => {
          setMessage(
            err.response?.data?.message || "Could not add to cart. Try again.",
          );
        },
      },
    );
  };

  const handleSelectSize = (e, size) => {
    e.stopPropagation();
    setSelectedSize(size);
    setMessage("");
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl">
      {/* Image */}
      <Link
        to={detailPath}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-neutral-100"
      >
        {mainImage && !imgFailed ? (
          <>
            <img
              src={mainImage}
              alt={title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            {hoverImage && !hoverFailed && (
              <img
                src={hoverImage}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setHoverFailed(true)}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            {imgFailed ? "Image unavailable" : "No image"}
          </div>
        )}

        {soldOut && (
          <span className="absolute left-3 top-3 rounded-md bg-black px-3 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-sm font-semibold text-black">
          <Link to={detailPath} className="transition hover:text-[#0047AB]">
            {title}
          </Link>
        </h3>

        <p className="mt-1 text-lg font-bold text-black">
          {price ? formatPrice(price) : "-"}
        </p>

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-xs text-neutral-600">Select size</p>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map(({ size, stock }) => {
                const outOfStock = stock === 0;
                const active = selectedSize === size;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={outOfStock}
                    aria-pressed={active}
                    onClick={(e) => handleSelectSize(e, size)}
                    className={`h-9 min-w-9 rounded-md border px-2 text-center text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-1 ${
                      outOfStock
                        ? "cursor-not-allowed border-neutral-200 text-neutral-300 line-through"
                        : active
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 text-black hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {message && (
          <p role="alert" className="mt-2 text-xs font-medium text-red-600">
            {message}
          </p>
        )}

        {/* Add to cart */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            disabled={soldOut || isAddingToCart}
            onClick={handleAddToCart}
            className={`flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 ${
              soldOut
                ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                : added
                  ? "bg-[#0047AB] text-white"
                  : "bg-black text-white hover:bg-[#0047AB] disabled:opacity-70"
            }`}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Adding...
              </>
            ) : added ? (
              <>
                <Check className="h-4 w-4" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                {soldOut ? "Sold out" : "Add to cart"}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;