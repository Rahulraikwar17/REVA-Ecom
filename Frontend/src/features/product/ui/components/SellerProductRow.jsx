import { Loader2, Pencil, Trash2 } from "lucide-react";

const SellerProductRow = ({
  product,
  onToggle,
  onEdit,
  onDelete,
  isListingProduct,
  listingProductId,
  isDeleting,
}) => {
  const { _id, title, description, images, price, sizes, published } = product;

  const totalStock = sizes?.reduce((sum, item) => sum + item.stock, 0) ?? 0;

  const isUpdating = isListingProduct && listingProductId === _id;

  // Disable this row's buttons while it is being updated or deleted
  const isBusy = isUpdating || isDeleting;

  const handleToggle = () => {
    onToggle(_id, !published);
  };

  return (
    <div
      className={`flex flex-col gap-5 rounded-lg border border-black/10 p-4 transition duration-300 hover:border-black hover:shadow-lg md:flex-row md:items-center md:gap-6 ${
        published ? "bg-white" : "bg-neutral-50"
      } ${isDeleting ? "pointer-events-none opacity-50" : ""}`}
    >
      <div className="relative shrink-0">
        <img
          src={images?.[0]}
          alt={title}
          className={`h-36 w-28 rounded-md bg-neutral-100 object-cover ${
            published ? "" : "opacity-60 grayscale"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold text-black">{title}</h3>

        <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
          {description}
        </p>

        <p
          className={`mt-3 text-sm font-semibold ${
            totalStock === 0 ? "text-red-600" : "text-black"
          }`}
        >
          {totalStock === 0 ? "Out of stock" : `${totalStock} in stock`}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {sizes?.map(({ size, stock }) => (
            <span
              key={size}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                stock === 0
                  ? "bg-red-50 text-red-700 ring-red-200"
                  : stock <= 5
                    ? "bg-amber-50 text-amber-800 ring-amber-200"
                    : "bg-white text-black ring-black/20"
              }`}
            >
              {size}: {stock}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-4 md:w-52 md:items-end">
        <p className="text-2xl font-bold tabular-nums text-black">
          ₹{price?.amount?.toLocaleString("en-IN")}
        </p>

        <div className="flex items-center gap-2.5">
          <span
            className={`flex items-center gap-1.5 text-sm font-medium ${
              published ? "text-black" : "text-neutral-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                published ? "bg-[#0047AB]" : "bg-neutral-400"
              }`}
            />
            {published ? "Published" : "Unpublished"}
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={published}
            aria-label={published ? "Unpublish product" : "Publish product"}
            disabled={isBusy}
            onClick={handleToggle}
            className={`relative h-6 w-11 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 ${
              published ? "bg-[#0047AB]" : "bg-neutral-300"
            } ${isBusy ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
          >
            {isUpdating ? (
              <Loader2
                size={14}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-white"
              />
            ) : (
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  published ? "translate-x-5" : "translate-x-0"
                }`}
              />
            )}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onEdit(product)}
            className="flex items-center gap-1.5 rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => onDelete(product)}
            className="flex items-center gap-1.5 rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProductRow;