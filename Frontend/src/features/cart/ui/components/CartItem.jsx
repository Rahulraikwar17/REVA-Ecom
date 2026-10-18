import { AlertCircle, Loader2, Minus, Plus, Trash2 } from "lucide-react";

function CartItem({
  item,
  index = 0,
  onRemove,
  isRemoving,
  onQuantityChange,
  isUpdating,
  error,
}) {
  const { product, quantity, size } = item;

  const imgSrc = product.images?.[0] || "/placeholder.png";
  const title = product.title || "Product";
  const unitPrice = product.price?.amount ?? 0;
  const lineTotal = unitPrice * quantity;

  const availableStock = item.availableStock;
  const hasStockInfo = typeof availableStock === "number";
  const atStockLimit = hasStockInfo && quantity >= availableStock;
  const lowStock = hasStockInfo && availableStock > 0 && availableStock <= 5;
  const stockLimitReached = error?.type === "stock";

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
      className={`cart-rise flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 transition duration-300 hover:border-neutral-400 sm:gap-6 sm:p-5 ${
        isRemoving ? "pointer-events-none opacity-40" : ""
      }`}
    >
      <img
        src={imgSrc}
        alt={title}
        className="aspect-[4/5] w-24 shrink-0 rounded-xl bg-neutral-100 object-cover sm:w-32"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-black sm:text-lg">
              {title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="rounded-md border border-neutral-300 px-2.5 py-0.5 text-xs font-semibold text-neutral-800">
                Size {size}
              </span>
              <span className="text-sm text-neutral-500">
                ₹{unitPrice.toLocaleString("en-IN")} each
              </span>
            </div>

            {lowStock && (
              <p className="mt-2 text-xs font-medium text-[#0047AB]">
                Only {availableStock} left in this size
              </p>
            )}
          </div>

          <p className="text-lg font-bold tabular-nums text-black sm:text-xl">
            ₹{lineTotal.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="inline-flex items-center rounded-full border border-neutral-300">
            <button
              onClick={() => onQuantityChange(item._id, quantity - 1)}
              disabled={quantity <= 1 || isUpdating}
              aria-label="Decrease quantity"
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus size={15} />
            </button>

            <span className="flex w-10 items-center justify-center text-sm font-semibold tabular-nums">
              {isUpdating ? (
                <Loader2 size={14} className="animate-spin text-neutral-500" />
              ) : (
                <span key={quantity} className="cart-pop">
                  {quantity}
                </span>
              )}
            </span>

            <button
              onClick={() => onQuantityChange(item._id, quantity + 1)}
              disabled={isUpdating || stockLimitReached || atStockLimit}
              aria-label="Increase quantity"
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Plus size={15} />
            </button>
          </div>

          <button
            onClick={() => onRemove(item._id)}
            disabled={isRemoving}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
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

        {error && (
          <p
            key={error.text}
            className="cart-shake mt-3 flex items-center gap-1.5 text-sm font-medium text-red-600"
          >
            <AlertCircle size={16} className="shrink-0" />
            {error.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default CartItem;