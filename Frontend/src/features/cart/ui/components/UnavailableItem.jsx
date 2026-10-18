import { Loader2, PackageX, Trash2 } from "lucide-react";

function UnavailableItem({ item, index = 0, onRemove, isRemoving }) {
  const product = item.product;
  const title = product?.title;
  const imgSrc = product?.images?.[0];

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
      className={`cart-rise flex items-center gap-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-4 sm:gap-6 sm:p-5 ${
        isRemoving ? "pointer-events-none opacity-40" : ""
      }`}
    >
      <div className="flex aspect-[4/5] w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-200 text-neutral-400 sm:w-32">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title || "Unavailable product"}
            className="h-full w-full object-cover opacity-50 grayscale"
          />
        ) : (
          <PackageX size={32} strokeWidth={1.5} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <span className="inline-block rounded-md bg-black px-2.5 py-0.5 text-xs font-semibold text-white">
          Unavailable
        </span>

        <h3 className="mt-2 truncate text-base font-semibold text-neutral-800">
          {title || "This product is no longer available"}
        </h3>

        <p className="mt-1 text-sm text-neutral-500">
          {product
            ? "This product is not available right now. Remove it from your cart to continue to checkout."
            : "It has been removed from the store. Remove it from your cart to continue to checkout."}
        </p>
      </div>

      <button
        onClick={() => onRemove(item._id)}
        disabled={isRemoving}
        className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRemoving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Removing...</span>
          </>
        ) : (
          <>
            <Trash2 size={16} />
            <span className="hidden sm:inline">Remove</span>
          </>
        )}
      </button>
    </div>
  );
}

export default UnavailableItem;