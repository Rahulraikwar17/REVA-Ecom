import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { AlertCircle, ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";
import useProducts from "../../hook/useProducts";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const MAX_IMAGES = 5;
const MAX_IMAGE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const inputClass =
  "w-full rounded-md border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-neutral-500 focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/25";

// Turns any API error into a list of readable messages
const getErrorMessages = (error) => {
  if (!error) return [];

  // Request timed out (slow upload)
  if (error.code === "ECONNABORTED") {
    return [
      "The upload took too long. Try smaller images or check your connection.",
    ];
  }

  // No response at all: server is down, no internet, or request was blocked
  if (!error.response) {
    return [
      "Cannot reach the server. Check your internet connection and try again.",
    ];
  }

  const { status, data } = error.response;

  // Validation errors, e.g. { errors: [{ msg, path }] }
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) =>
      typeof e === "string" ? e : e.msg || e.message || "Invalid value",
    );
  }

  // The server may send JSON ({ message }) or a plain/HTML error page
  const message =
    typeof data === "string" ? "" : data?.message || data?.error || "";
  const searchable = `${typeof data === "string" ? data : ""} ${message}`;

  // Upload errors (multer)
  if (status === 413 || /file too large|limit_file_size/i.test(searchable)) {
    return [
      `One of the images is too large. Each image must be smaller than ${MAX_IMAGE_MB} MB.`,
    ];
  }
  if (
    /unexpected field|limit_unexpected_file|too many files/i.test(searchable)
  ) {
    return [`Too many images. You can upload up to ${MAX_IMAGES} images.`];
  }

  // Show whatever message the backend sent
  if (message) return [String(message)];

  if (status === 401) return ["Your session has expired. Please log in again."];
  if (status === 403) return ["You do not have permission to add products."];
  if (status >= 500)
    return ["Something went wrong on the server. Please try again."];

  return [`Request failed (status ${status}).`];
};

const Field = ({ label, error, hint, children }) => (
  <div>
    <label className="mb-1.5 block text-sm font-semibold text-black">
      {label}
    </label>
    {children}
    {hint && !error && (
      <p className="mt-1.5 text-xs text-neutral-600">{hint}</p>
    )}
    {error && (
      <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
    )}
  </div>
);

const AddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct, productAdding, addProductError } = useProducts();
  const errorMessages = getErrorMessages(addProductError);

  // Images are kept outside the form: [{ file, preview }]
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [sizesError, setSizesError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      sizes: SIZES.map((size) => ({ size, enabled: false, stock: "" })),
      published: true,
    },
  });

  const sizeValues = watch("sizes");
  const hasSizes = sizeValues.some((s) => s.enabled);

  useEffect(() => {
    if (hasSizes) setSizesError("");
  }, [hasSizes]);

  // Free the preview URLs when leaving the page
  useEffect(
    () => () =>
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview)),
    [],
  );

  const addFiles = (fileList) => {
    const valid = [];
    let message = "";

    for (const file of Array.from(fileList)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        message = `${file.name}: only JPG, PNG or WebP images are allowed`;
      } else if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        message = `${file.name}: image must be smaller than ${MAX_IMAGE_MB} MB`;
      } else {
        valid.push(file);
      }
    }

    const room = MAX_IMAGES - images.length;
    if (valid.length > room) {
      message = `You can upload up to ${MAX_IMAGES} images`;
    }

    const accepted = valid.slice(0, Math.max(room, 0)).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...accepted]);
    setImageError(message);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (images.length < MAX_IMAGES) addFiles(e.dataTransfer.files);
  };

  const onSubmit = (data) => {
    const selectedSizes = data.sizes
      .filter((s) => s.enabled)
      .map((s) => ({ size: s.size, stock: Number(s.stock) }));

    if (selectedSizes.length === 0) {
      setSizesError("Select at least one size");
      return;
    }
    if (images.length === 0) {
      setImageError("Add at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title.trim());
    formData.append("description", data.description.trim());
    // Backend expects price as a JSON string: {"amount":450,"currency":"INR"}
    formData.append(
      "price",
      JSON.stringify({ amount: Number(data.price), currency: "INR" }),
    );
    formData.append("sizes", JSON.stringify(selectedSizes));
    formData.append("published", String(data.published));
    images.forEach(({ file }) => formData.append("images", file));

    addProduct(formData, {
      onSuccess: () => navigate("/seller/products"),
    });
  };

  const isFull = images.length >= MAX_IMAGES;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/seller/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-[#0047AB]"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <h1 className="mt-3 text-3xl font-bold text-black">Add new product</h1>
      <div className="mt-2 h-1 w-12 rounded-full bg-[#0047AB]" />
      <p className="mt-3 text-neutral-600">
        Fill in the details. Customers will see this on the store.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_380px]"
      >
        {/* Left: details */}
        <div className="space-y-6 rounded-lg border border-black/10 bg-white p-6">
          <Field label="Title" error={errors.title?.message}>
            <input
              className={inputClass}
              placeholder="e.g. Oversized Abstract Print T-Shirt"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Title is too short" },
              })}
            />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <textarea
              rows={4}
              className={inputClass}
              placeholder="Fabric, fit, care instructions"
              {...register("description", {
                required: "Description is required",
              })}
            />
          </Field>

          <Field
            label="Price (INR)"
            error={errors.price?.message}
            hint="Price per piece, in rupees"
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
                ₹
              </span>
              <input
                type="number"
                inputMode="numeric"
                className={`${inputClass} pl-8`}
                placeholder="599"
                {...register("price", {
                  required: "Price is required",
                  validate: (v) =>
                    (Number.isInteger(Number(v)) && Number(v) >= 1) ||
                    "Enter a whole number of 1 or more",
                })}
              />
            </div>
          </Field>

          {/* Sizes */}
          <div>
            <p className="mb-1.5 text-sm font-semibold text-black">
              Sizes and stock
            </p>
            <p className="mb-3 text-xs text-neutral-600">
              Tick the sizes you sell, then enter how many pieces are in stock.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {SIZES.map((size, i) => {
                const enabled = sizeValues[i]?.enabled;
                const stockError = errors.sizes?.[i]?.stock?.message;

                return (
                  <div
                    key={size}
                    className={`rounded-md border p-3 transition ${
                      enabled
                        ? "border-[#0047AB] bg-[#0047AB]/5"
                        : "border-black/15 bg-white hover:border-black"
                    }`}
                  >
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-300 accent-[#0047AB]"
                        {...register(`sizes.${i}.enabled`)}
                      />
                      <span className="text-sm font-semibold text-black">
                        {size}
                      </span>
                    </label>

                    {enabled && (
                      <div className="mt-3">
                        <input
                          type="number"
                          inputMode="numeric"
                          placeholder="Stock"
                          className={`${inputClass} py-2`}
                          {...register(`sizes.${i}.stock`, {
                            validate: (value, formValues) =>
                              !formValues.sizes[i].enabled ||
                              (value !== "" &&
                                Number.isInteger(Number(value)) &&
                                Number(value) >= 0) ||
                              "Enter stock (0 or more)",
                          })}
                        />
                        {stockError && (
                          <p className="mt-1 text-xs font-medium text-red-600">
                            {stockError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {sizesError && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {sizesError}
              </p>
            )}
          </div>
        </div>

        {/* Right: images + publish */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-black">Images</p>
              <span className="text-xs font-medium text-neutral-600">
                {images.length}/{MAX_IMAGES}
              </span>
            </div>

            <button
              type="button"
              disabled={isFull}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                if (!isFull) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                isDragging
                  ? "border-[#0047AB] bg-[#0047AB]/5"
                  : "border-black/30 bg-neutral-50 hover:border-black"
              }`}
            >
              <ImagePlus size={28} className="text-black" />
              <span className="text-sm font-semibold text-black">
                {isFull ? "Maximum images added" : "Click or drop images here"}
              </span>
              <span className="text-xs text-neutral-600">
                JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB each
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />

            {imageError && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {imageError}
              </p>
            )}

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div
                    key={img.preview}
                    className="relative aspect-[4/5] overflow-hidden rounded-md bg-neutral-100 ring-1 ring-black/10"
                  >
                    <img
                      src={img.preview}
                      alt={`Product ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-black px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label={`Remove image ${i + 1}`}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-white text-black shadow transition hover:bg-red-600 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-black">
                  List this product
                </p>
                <p className="text-xs text-neutral-600">
                  Customers can see and buy it right away.
                </p>
              </div>
              <input
                type="checkbox"
                className="peer sr-only"
                {...register("published")}
              />
              <span className="relative h-6 w-11 shrink-0 rounded-full bg-neutral-300 transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-[#0047AB] peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-[#0047AB]/40" />
            </label>
          </div>

          {errorMessages.length > 0 && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Could not add the product</p>
                {errorMessages.length === 1 ? (
                  <p className="mt-0.5">{errorMessages[0]}</p>
                ) : (
                  <ul className="mt-1 list-disc space-y-0.5 pl-4">
                    {errorMessages.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              to="/seller/products"
              className="flex flex-1 items-center justify-center rounded-md border border-black bg-white py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={productAdding}
              className="flex flex-[2] items-center justify-center gap-2 rounded-md bg-black py-3 text-sm font-semibold text-white transition hover:bg-[#0047AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {productAdding ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Adding product...
                </>
              ) : (
                "Add product"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;