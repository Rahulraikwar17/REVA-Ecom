import React from "react";
import useProducts from "../../hook/useProducts";
import ProductCard from "../components/ProductCard";

const GRID =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

// Keeps a single card from stretching across the whole screen on phones
const CARD_WRAP = "mx-auto w-full max-w-sm sm:max-w-none";

const ProductPage = () => {
  const { allproducts, fetchingProducts, productsFetchError } = useProducts();

  if (fetchingProducts) {
    return (
      <div
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        role="status"
        aria-label="Loading products"
      >
        <div className="mb-8 h-9 w-48 animate-pulse rounded bg-neutral-200" />
        <div className={GRID}>
          {Array.from({ length: 8 }).map((_, i) => (
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
      </div>
    );
  }

  if (productsFetchError) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h2 className="text-xl font-semibold text-black">
          Could not load products
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          {productsFetchError.response?.data?.message ||
            productsFetchError.message}
        </p>
      </div>
    );
  }

  if (allproducts.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h2 className="text-xl font-semibold text-black">No products found</h2>
        <p className="mt-2 text-sm text-neutral-600">
          New styles will appear here soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black sm:text-3xl">
          All products
        </h1>
        <div className="mt-2 h-1 w-12 rounded-full bg-[#0047AB]" />
        <p className="mt-3 text-sm text-neutral-600">
          {allproducts.length} {allproducts.length === 1 ? "style" : "styles"}
        </p>
      </div>

      <div className={GRID}>
        {allproducts.map((product) => (
          <div key={product._id} className={CARD_WRAP}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;