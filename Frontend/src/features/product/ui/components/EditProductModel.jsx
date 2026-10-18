import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Trash2, Loader2, ImagePlus } from "lucide-react";

const inputCls =
  "w-full rounded-md border border-black/20 bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-500 transition focus:border-[#0047AB] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/25 disabled:bg-neutral-50 disabled:text-neutral-500";

// Same list as the backend validator
const ALLOWED_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const Label = ({ children }) => (
  <label className="mb-1.5 block text-sm font-semibold text-black">
    {children}
  </label>
);

/**
 * Edit product popup.
 *
 * Props:
 *  - open      (bool)    show / hide
 *  - product   (object)  the product being edited (form is pre-filled from it)
 *  - loading   (bool)    true while the edit API is running
 *  - error     (string)  API error message to show inside the popup
 *  - onSave    (fn)      called with the updated data as FormData
 *  - onCancel  (fn)      close the popup
 *
 * The popup closes only with the Cancel or X button (not by clicking
 * outside or pressing Escape).
 * Tip: render it with key={product?._id} so the form resets for every product.
 */
const EditProductModal = ({
  open,
  product,
  loading = false,
  error = "",
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [amount, setAmount] = useState(product?.price?.amount ?? "");
  const [images, setImages] = useState(product?.images ?? []);
  const [sizes, setSizes] = useState(
    (product?.sizes ?? []).map(({ size, stock }) => ({ size, stock })),
  );
  const [newFiles, setNewFiles] = useState([]);
  const [formError, setFormError] = useState("");

  // Revoke preview URLs when the modal unmounts
  const filesRef = useRef([]);
  filesRef.current = newFiles;
  useEffect(
    () => () => filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview)),
    [],
  );

  if (!open || !product) return null;

  // Existing images (URLs) the seller wants to keep
  const removeImage = (index) =>
    setImages(images.filter((_, i) => i !== index));

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files ?? []);
    // Allow choosing the same file again
    e.target.value = "";

    setFormError("");
    const valid = [];

    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        setFormError("Only image files are allowed");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError(`${file.name} is larger than 5 MB`);
        continue;
      }
      valid.push({ file, preview: URL.createObjectURL(file) });
    }

    if (valid.length) setNewFiles((prev) => [...prev, ...valid]);
  };

  const removeNewFile = (index) => {
    URL.revokeObjectURL(newFiles[index].preview);
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const updateSize = (index, field, value) =>
    setSizes(sizes.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  const usedSizes = sizes.map((s) => s.size);
  const availableSizes = ALLOWED_SIZES.filter((sz) => !usedSizes.includes(sz));

  const addSize = () => {
    if (!availableSizes.length) return;
    setSizes([...sizes, { size: availableSizes[0], stock: 0 }]);
  };

  const removeSize = (index) => setSizes(sizes.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return setFormError("Title is required");

    const price = Number(amount);
    if (!price || price <= 0) return setFormError("Enter a valid price");

    const names = sizes.map((s) => s.size.trim().toLowerCase());
    if (names.some((n) => !n)) return setFormError("Every size needs a name");
    if (new Set(names).size !== names.length)
      return setFormError("Sizes must be unique");

    if (sizes.some((s) => !ALLOWED_SIZES.includes(s.size.trim())))
      return setFormError(`Size must be one of ${ALLOWED_SIZES.join(", ")}`);

    if (
      sizes.some(
        (s) => !Number.isInteger(Number(s.stock)) || Number(s.stock) < 0,
      )
    )
      return setFormError("Stock must be a whole number (0 or more)");

    setFormError("");

    // The backend expects FormData (multer files plus text fields)
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append(
      "price",
      JSON.stringify({
        amount: price,
        currency: product.price?.currency ?? "INR",
      }),
    );
    formData.append(
      "sizes",
      JSON.stringify(
        sizes.map((s) => ({ size: s.size.trim(), stock: Number(s.stock) })),
      ),
    );
    // URLs of the existing images to keep
    formData.append("existingImages", JSON.stringify(images));
    // Newly uploaded files
    newFiles.forEach(({ file }) => formData.append("images", file));

    onSave(formData);
  };

  const shownError = formError || error;
  const imageCount = images.length + newFiles.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-product-title"
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-[#0047AB] bg-black px-6 py-4">
          <h3
            id="edit-product-title"
            className="text-lg font-semibold text-white"
          >
            Edit product
          </h3>
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            aria-label="Close"
            className="rounded-md p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 overflow-y-auto px-6 py-6">
          <div>
            <Label>Title</Label>
            <input
              className={inputCls}
              value={title}
              disabled={loading}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              rows={3}
              className={inputCls}
              value={description}
              disabled={loading}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="max-w-[200px]">
            <Label>Price (₹)</Label>
            <input
              type="number"
              min="1"
              className={inputCls}
              value={amount}
              disabled={loading}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Images */}
          <div>
            <Label>Images ({imageCount})</Label>

            {imageCount > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((src, i) => (
                  <div
                    key={src}
                    className="relative aspect-[4/5] overflow-hidden rounded-md bg-neutral-100 ring-1 ring-black/10"
                  >
                    <img
                      src={src}
                      alt={`Product ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 rounded bg-black px-2 py-0.5 text-[11px] font-semibold text-white">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-white text-black shadow transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {newFiles.map((f, i) => (
                  <div
                    key={f.preview}
                    className="relative aspect-[4/5] overflow-hidden rounded-md bg-neutral-100 ring-2 ring-[#0047AB]"
                  >
                    <img
                      src={f.preview}
                      alt={`New ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-[#0047AB] px-2 py-0.5 text-[11px] font-semibold text-white">
                      {images.length === 0 && i === 0 ? "New cover" : "New"}
                    </span>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => removeNewFile(i)}
                      aria-label="Remove new image"
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-white text-black shadow transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-md border border-dashed border-black/20 bg-neutral-50 px-3 py-6 text-center text-sm text-neutral-600">
                No images yet
              </p>
            )}

            <label
              className={`mt-3 inline-flex items-center gap-2 rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white ${
                loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              <ImagePlus size={16} /> Upload images
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={loading}
                onChange={handleFiles}
              />
            </label>
            <p className="mt-1.5 text-xs text-neutral-600">
              Images up to 5 MB each. The first image is shown as the cover.
            </p>
          </div>

          {/* Sizes */}
          <div>
            <Label>Sizes &amp; stock</Label>

            <div className="space-y-2">
              {sizes.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    className={`${inputCls} max-w-[120px]`}
                    value={s.size}
                    disabled={loading}
                    onChange={(e) => updateSize(i, "size", e.target.value)}
                  >
                    {/* Keep the current value visible even if it is not in the list, then offer only unused sizes */}
                    {!ALLOWED_SIZES.includes(s.size) && (
                      <option value={s.size}>{s.size}</option>
                    )}
                    {ALLOWED_SIZES.filter(
                      (opt) => opt === s.size || !usedSizes.includes(opt),
                    ).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    className={`${inputCls} max-w-[120px]`}
                    placeholder="Stock"
                    value={s.stock}
                    disabled={loading}
                    onChange={(e) => updateSize(i, "stock", e.target.value)}
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => removeSize(i)}
                    aria-label="Remove size"
                    className="rounded-md p-2 text-neutral-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {availableSizes.length > 0 ? (
              <button
                type="button"
                disabled={loading}
                onClick={addSize}
                className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[#0047AB] transition hover:text-black disabled:opacity-50"
              >
                <Plus size={16} /> Add size
              </button>
            ) : (
              <p className="mt-3 text-xs text-neutral-600">
                All sizes are added.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-black/10 bg-neutral-50 px-6 py-4">
          {shownError && (
            <p
              role="alert"
              className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {shownError}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="rounded-md border border-black bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0047AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProductModal;