import React from "react";
import { Link } from "react-router";
import useProducts from "../../../features/product/hook/useProducts";
import ProductCard from "../../../features/product/ui/components/ProductCard";

const GRID =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

// Keeps a single card from stretching across the whole screen on phones
const CARD_WRAP = "mx-auto w-full max-w-sm sm:max-w-none";

const NewArrivals = ({ limit = 8 }) => {
  const { allproducts, fetchingProducts, productsFetchError } = useProducts();

  // If products fail to load, hide this section so the rest of the page still works
  if (productsFetchError) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black sm:text-3xl">
            New arrivals
          </h2>
          <div className="mt-2 h-1 w-12 rounded-full bg-[#0047AB]" />
          <p className="mt-3 text-sm text-neutral-600">
            Fresh picks, just landed.
          </p>
        </div>
        <Link
          to="/products"
          className="rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:border-[#0047AB] hover:bg-[#0047AB] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2"
        >
          View all
        </Link>
      </div>

      {fetchingProducts ? (
        <div className={GRID} role="status" aria-label="Loading products">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className={CARD_WRAP}>
              <div className="animate-pulse overflow-hidden rounded-lg border border-black/10">
                <div className="aspect-[4/5] bg-neutral-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-neutral-200" />
                  <div className="h-5 w-1/3 rounded bg-neutral-200" />
                  <div className="h-11 w-full rounded bg-neutral-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={GRID}>
          {allproducts.slice(0, limit).map((product) => (
            <div key={product._id} className={CARD_WRAP}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NewArrivals;