import React, { useState } from "react";
import { Link } from "react-router";
import { AlertCircle, Plus, X } from "lucide-react";
import useProducts from "../../hook/useProducts";
import SellerProductRow from "../components/SellerProductRow";
import EditProductModal from "../components/EditProductModel";
import ConfirmModal from "../../../../shared/ui/components/ConfirmModel";

// Returns the first backend validator error (errors[0].msg) or the normal message
const getErrorMessage = (err) =>
  err?.response?.data?.errors?.[0]?.msg ||
  err?.response?.data?.message ||
  err?.message ||
  "Something went wrong";

const AddProductLink = () => (
  <Link
    to="/seller/products/new"
    className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0047AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2"
  >
    <Plus size={16} />
    Add product
  </Link>
);

const SellerProductPage = () => {
  const {
    allSellerProducts,
    fetchingSellerProducts,
    sellerProductsFetchError,
    listingProduct,
    isListingProduct,
    deleteProduct,
    productDeleting,
    deleteProductError,
    editProduct,
    productUpdating,
    productUpdateError,
  } = useProducts();

  const [listingProductId, setListingProductId] = useState(null);

  // Delete states
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [showDeleteError, setShowDeleteError] = useState(false);

  // Edit states
  const [productToEdit, setProductToEdit] = useState(null);
  const [showEditError, setShowEditError] = useState(false);

  const handleToggle = (id, published) => {
    setListingProductId(id);

    listingProduct(
      {
        id: String(id),
        data: { published: Boolean(published) },
      },
      {
        onError: (error) => {
          console.error(
            "Listing error:",
            error.response?.data || error.message,
          );
        },
        onSettled: () => setListingProductId(null),
      },
    );
  };

  /* ---------- EDIT ---------- */
  const handleEditClick = (product) => {
    setShowEditError(false);
    setProductToEdit(product);
  };

  // data = FormData (title, description, price, sizes, existingImages, images files)
  const handleSaveEdit = (data) => {
    if (!productToEdit) return;

    setShowEditError(false);

    editProduct(
      { id: String(productToEdit._id), data },
      {
        // Close the popup on success
        onSuccess: () => setProductToEdit(null),
        // The error is shown inside the popup
        onError: () => setShowEditError(true),
      },
    );
  };

  /* ---------- DELETE ---------- */
  const handleDeleteClick = (product) => {
    setShowDeleteError(false);
    setProductToDelete(product);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    const id = productToDelete._id;

    setDeletingProductId(id);
    setShowDeleteError(false);

    // The modal stays open (with loading) until the API call finishes
    deleteProduct(String(id), {
      onError: () => setShowDeleteError(true),
      onSettled: () => {
        setDeletingProductId(null);
        setProductToDelete(null);
      },
    });
  };

  if (fetchingSellerProducts) {
    return (
      <div
        className="mx-auto max-w-7xl px-4 py-8"
        role="status"
        aria-label="Loading products"
      >
        <div className="mb-8 h-9 w-56 animate-pulse rounded bg-neutral-200" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse gap-5 rounded-lg border border-black/10 p-4"
            >
              <div className="h-36 w-28 rounded-md bg-neutral-200" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-1/3 rounded bg-neutral-200" />
                <div className="h-4 w-2/3 rounded bg-neutral-200" />
                <div className="h-4 w-1/4 rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sellerProductsFetchError) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <AlertCircle size={32} className="mx-auto text-red-600" />
        <h2 className="mt-4 text-xl font-semibold text-black">
          Could not load your products
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          {getErrorMessage(sellerProductsFetchError)}
        </p>
      </div>
    );
  }

  if (!allSellerProducts || allSellerProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg border-2 border-dashed border-black/20 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-black">No products yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
            Add your first product to start selling on the store.
          </p>
          <div className="mt-6">
            <AddProductLink />
          </div>
        </div>
      </div>
    );
  }

  const publishedCount = allSellerProducts.filter((p) => p.published).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Your products</h1>
          <div className="mt-2 h-1 w-12 rounded-full bg-[#0047AB]" />
          <p className="mt-3 text-sm text-neutral-600">
            {allSellerProducts.length} total, {publishedCount} published
          </p>
        </div>
        <AddProductLink />
      </div>

      {/* Delete error banner */}
      {showDeleteError && deleteProductError && (
        <div
          role="alert"
          className="mb-4 flex items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p>Failed to delete product: {getErrorMessage(deleteProductError)}</p>
          <button
            type="button"
            onClick={() => setShowDeleteError(false)}
            aria-label="Close"
            className="shrink-0 text-red-600 transition hover:text-red-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {allSellerProducts.map((product) => (
          <SellerProductRow
            key={product._id}
            product={product}
            onToggle={handleToggle}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            isListingProduct={isListingProduct}
            listingProductId={listingProductId}
            isDeleting={productDeleting && deletingProductId === product._id}
          />
        ))}
      </div>

      {/* Edit popup (the form is pre-filled from the product) */}
      <EditProductModal
        key={productToEdit?._id}
        open={!!productToEdit}
        product={productToEdit}
        loading={productUpdating}
        error={
          showEditError && productUpdateError
            ? getErrorMessage(productUpdateError)
            : ""
        }
        onSave={handleSaveEdit}
        onCancel={() => setProductToEdit(null)}
      />

      {/* Reusable confirmation popup */}
      <ConfirmModal
        open={!!productToDelete}
        title="Delete this product?"
        message={
          <>
            <span className="font-semibold text-black">
              {productToDelete?.title}
            </span>{" "}
            will be permanently deleted. This action cannot be undone.
          </>
        }
        confirmText="Yes, delete"
        variant="danger"
        loading={productDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
};

export default SellerProductPage;