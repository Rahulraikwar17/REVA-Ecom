import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Banknote,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useProductDetail } from "../../hook/useProducts";
import useCart from "../../../cart/hook/useCart";

const MAX_QTY = 10;

const formatINR = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const ProductDetailPage = () => {
  const { id } = useParams();
  const { product, fetchingProduct, productError } = useProductDetail(id);
  const { addToCart, isAddingToCart } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // Reset everything when the product changes
  useEffect(() => {
    setActiveImage(0);
    setSelectedSize(null);
    setQuantity(1);
    setMessage("");
    setImgFailed(false);
  }, [id]);

  /* ---------- loading / error states ---------- */
  if (fetchingProduct) {
    return (
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-2">
        <div className="aspect-[4/5] animate-pulse rounded-lg bg-neutral-200" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-neutral-200" />
          <div className="h-6 w-1/4 animate-pulse rounded bg-neutral-200" />
          <div className="h-24 animate-pulse rounded bg-neutral-200" />
          <div className="h-12 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    );
  }

  if (productError || !product) {
    const notFound = productError?.response?.status === 404;

    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h2 className="text-xl font-semibold text-black">
          {notFound ? "Product not found" : "Could not load this product"}
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          {notFound
            ? "This product may have been removed."
            : productError?.response?.data?.message ||
              productError?.message ||
              "Please try again."}
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0047AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>
      </div>
    );
  }

  /* ---------- derived values ---------- */
  const { title, description, images = [], price, sizes = [] } = product;

  const selected = sizes.find((s) => s.size === selectedSize);
  const stock = selected?.stock ?? 0;
  // Stock of the selected size, otherwise just MAX_QTY
  const maxQty = selected ? Math.min(stock, MAX_QTY) : MAX_QTY;
  const soldOut = sizes.length > 0 && sizes.every((s) => s.stock === 0);
  const mainImage = images[activeImage];

  const showImage = (index) => {
    setActiveImage((index + images.length) % images.length);
    setImgFailed(false);
  };

  const handleSelectSize = (size) => {
    const sizeStock = sizes.find((s) => s.size === size)?.stock ?? MAX_QTY;

    setSelectedSize(size);
    setQuantity((q) => Math.max(1, Math.min(q, sizeStock, MAX_QTY)));
    setMessage("");
  };

  // Keep a typed quantity between 1 and maxQty
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(Number.isNaN(value) ? 1 : Math.max(1, Math.min(value, maxQty)));
  };

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      setMessage("Please select a size");
      return;
    }

    if (selected && quantity > selected.stock) {
      setMessage(`Only ${selected.stock} available in size ${selectedSize}`);
      return;
    }

    setMessage("");

    // API body: productId (from the URL), size, quantity
    addToCart(
      { productId: id, size: selectedSize, quantity },
      {
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        },
        onError: (err) => {
          setMessage(
            err.response?.data?.errors?.[0]?.msg ||
              err.response?.data?.message ||
              "Could not add to cart. Try again.",
          );
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-[#0047AB]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        {/* ---------- Gallery ---------- */}
        <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
          <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-black/10 lg:w-auto lg:min-w-0 lg:flex-1">
            {mainImage && !imgFailed ? (
              <img
                src={mainImage}
                alt={title}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                {imgFailed ? "Image failed to load" : "No image"}
              </div>
            )}

            {soldOut && (
              <span className="absolute left-4 top-4 rounded-md bg-black px-3 py-1 text-xs font-semibold text-white">
                Sold out
              </span>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => showImage(activeImage - 1)}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white text-black shadow transition hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => showImage(activeImage + 1)}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white text-black shadow transition hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB]"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-semibold text-white">
                  {activeImage + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="relative lg:w-20 lg:shrink-0">
              <div className="flex gap-3 overflow-x-auto p-1 lg:absolute lg:inset-0 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => showImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === activeImage}
                    className={`aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-md bg-neutral-100 ring-2 transition lg:w-full ${
                      i === activeImage
                        ? "ring-[#0047AB]"
                        : "opacity-60 ring-transparent hover:opacity-100 hover:ring-black"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${title} ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---------- Info ---------- */}
        <div>
          <h1 className="text-2xl font-bold text-black sm:text-3xl">{title}</h1>

          <p className="mt-3 text-3xl font-bold text-black">
            {price ? formatINR(price.amount, price.currency) : "-"}
          </p>
          <div className="mt-3 h-1 w-12 rounded-full bg-[#0047AB]" />

          <p className="mt-5 leading-relaxed text-neutral-600">{description}</p>

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-black">
                  Select size
                </h2>
                {selected && (
                  <span
                    className={`text-xs font-semibold ${
                      stock === 0
                        ? "text-red-600"
                        : stock <= 5
                          ? "text-amber-700"
                          : "text-[#0047AB]"
                    }`}
                  >
                    {stock === 0
                      ? "Out of stock"
                      : stock <= 5
                        ? `Only ${stock} left`
                        : "In stock"}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map(({ size, stock: sizeStock }) => {
                  const outOfStock = sizeStock === 0;
                  const active = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={outOfStock}
                      aria-pressed={active}
                      onClick={() => handleSelectSize(size)}
                      className={`min-w-14 rounded-md border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 ${
                        outOfStock
                          ? "cursor-not-allowed border-neutral-200 text-neutral-300 line-through"
                          : active
                            ? "border-black bg-black text-white"
                            : "border-black/25 text-black hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          {!soldOut && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-black">Quantity</h2>
              <div className="mt-3 flex items-center gap-4">
                <div className="inline-flex items-center overflow-hidden rounded-md border border-black/25">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => q - 1)}
                    className="p-3 text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxQty}
                    value={quantity}
                    onChange={handleQuantityChange}
                    aria-label="Quantity"
                    className="w-12 border-x border-black/15 py-2 text-center text-sm font-semibold text-black focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= maxQty}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {price && quantity > 1 && (
                  <span className="text-sm text-neutral-600">
                    Total:{" "}
                    <b className="text-black">
                      {formatINR(price.amount * quantity, price.currency)}
                    </b>
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-neutral-600">
                {!selectedSize
                  ? "Select a size to see availability"
                  : quantity >= maxQty
                    ? maxQty === stock
                      ? `Only ${stock} available in this size`
                      : `Maximum ${MAX_QTY} per order`
                    : `${stock} available in this size`}
              </p>
            </div>
          )}

          {message && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-600">
              {message}
            </p>
          )}

          {/* Add to cart */}
          <button
            type="button"
            disabled={soldOut || isAddingToCart}
            onClick={handleAddToCart}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-md px-6 py-4 text-sm font-semibold transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 sm:w-auto sm:min-w-[280px] ${
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
                <Check className="h-4 w-4" /> Added to cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                {soldOut ? "Sold out" : "Add to cart"}
              </>
            )}
          </button>

          {/* Perks */}
          <div className="mt-8 grid gap-3 rounded-lg border border-black/10 bg-neutral-50 p-5 text-sm text-neutral-700">
            <p className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-[#0047AB]" /> Free delivery on
              orders above ₹999
            </p>
            <p className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-[#0047AB]" /> 7-day easy
              returns
            </p>
            <p className="flex items-center gap-3">
              <Banknote className="h-4 w-4 text-[#0047AB]" /> Cash on delivery
              available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;