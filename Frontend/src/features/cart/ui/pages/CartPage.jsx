import React, { useState } from "react";
import { AlertCircle, BadgePercent, Loader2, Trash2 } from "lucide-react";
import useCart from "../../hook/useCart";
import CartItem from "../components/CartItem";
import CartStyles from "../components/CartStyles";
import EmptyCart from "../components/EmptyCart";
import UnavailableItem from "../components/UnavailableItem";

const SALE_PERCENT = 20;
const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

const getErrorInfo = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message ?? "";

  if (/stock/i.test(message)) {
    return { type: "stock", text: "No more stock available for this size" };
  }
  if (status === 404 && /product/i.test(message)) {
    return { type: "unavailable", text: "This product is no longer available" };
  }
  return {
    type: "error",
    text: message || "Something went wrong. Please try again.",
  };
};

const CartSkeleton = () => (
  <div className="mx-auto max-w-6xl p-4 sm:p-6">
    <div className="mb-6 h-9 w-48 animate-pulse rounded-lg bg-neutral-200" />

    <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex gap-4 rounded-2xl border border-neutral-200 p-4 sm:gap-6 sm:p-5"
          >
            <div className="aspect-[4/5] w-24 animate-pulse rounded-xl bg-neutral-200 sm:w-32" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-2/3 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
              <div className="h-9 w-28 animate-pulse rounded-full bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="h-72 animate-pulse rounded-2xl bg-neutral-200" />
    </div>
  </div>
);

const CartPage = () => {
  const {
    getCartItems,
    fetchingCartItems,
    fetchCartItemsError,
    removeCartItem,
    updateCartItem,
    clearCart,
    isClearingCart,
  } = useCart();

  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [itemErrors, setItemErrors] = useState({});
  const [confirmingClear, setConfirmingClear] = useState(false);

  const clearItemError = (itemId) =>
    setItemErrors((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });

  const handleRemove = (itemId) => {
    setRemovingId(itemId);
    removeCartItem(itemId, {
      onError: () => setRemovingId(null),
    });
  };

  const handleQuantityChange = (itemId, quantity) => {
    clearItemError(itemId);
    setUpdatingId(itemId);
    updateCartItem(
      { itemId, quantity },
      {
        onError: (error) =>
          setItemErrors((prev) => ({ ...prev, [itemId]: getErrorInfo(error) })),
        onSettled: () => setUpdatingId(null),
      },
    );
  };

  const handleClearCart = () => {
    clearCart(undefined, {
      onSettled: () => setConfirmingClear(false),
    });
  };

  if (fetchingCartItems) {
    return (
      <>
        <CartStyles />
        <CartSkeleton />
      </>
    );
  }

  if (fetchCartItemsError) {
    return (
      <>
        <CartStyles />
        <div className="cart-rise mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={30} />
          </span>
          <h2 className="mt-6 text-2xl font-bold text-black">
            We could not load your cart
          </h2>
          <p className="mt-2 text-neutral-500">
            {fetchCartItemsError?.response?.data?.message ||
              "Check your connection and try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0047AB]"
          >
            Reload page
          </button>
        </div>
      </>
    );
  }

  const allItems = getCartItems?.data?.cart?.products ?? [];

  if (allItems.length === 0) {
    return (
      <>
        <CartStyles />
        <EmptyCart />
      </>
    );
  }

  const availableItems = allItems.filter(
    (item) => item.product && !item.isUnavailable,
  );
  const hasUnavailable = availableItems.length !== allItems.length;

  const totalQty = availableItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = availableItems.reduce(
    (sum, item) => sum + (item.product.price?.amount ?? 0) * item.quantity,
    0,
  );
  const discount = Math.round((subtotal * SALE_PERCENT) / 100);
  const total = subtotal - discount;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <CartStyles />

      <div className="cart-rise mb-8 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-black">
          Your cart{" "}
          <span className="text-base font-medium text-neutral-500">
            ({totalQty} {totalQty === 1 ? "item" : "items"})
          </span>
        </h2>

        {confirmingClear ? (
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-neutral-600 sm:inline">
              Remove all items?
            </span>
            <button
              onClick={() => setConfirmingClear(false)}
              disabled={isClearingCart}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={handleClearCart}
              disabled={isClearingCart}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {isClearingCart && <Loader2 size={14} className="animate-spin" />}
              {isClearingCart ? "Clearing..." : "Yes, clear"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingClear(true)}
            className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
            Clear cart
          </button>
        )}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {allItems.map((item, index) =>
            item.product && !item.isUnavailable ? (
              <CartItem
                key={item._id}
                item={item}
                index={index}
                onRemove={handleRemove}
                isRemoving={removingId === item._id}
                onQuantityChange={handleQuantityChange}
                isUpdating={updatingId === item._id}
                error={itemErrors[item._id]}
              />
            ) : (
              <UnavailableItem
                key={item._id}
                item={item}
                index={index}
                onRemove={handleRemove}
                isRemoving={removingId === item._id}
              />
            ),
          )}
        </div>

        <aside
          style={{ animationDelay: "150ms" }}
          className="cart-rise rounded-2xl border-t-4 border-[#0047AB] bg-black p-6 text-white lg:sticky lg:top-24"
        >
          <h3 className="text-lg font-semibold">Order summary</h3>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})</span>
              <span className="tabular-nums text-white">{inr(subtotal)}</span>
            </div>

            <div className="flex justify-between text-[#7CA8FF]">
              <span className="flex items-center gap-1.5">
                <BadgePercent size={16} />
                Sale discount ({SALE_PERCENT}%)
              </span>
              <span className="tabular-nums">− {inr(discount)}</span>
            </div>
          </div>

          <div className="my-6 border-t border-dashed border-white/20" />

          <div className="flex items-end justify-between">
            <span className="text-base text-neutral-300">Total</span>
            <span
              key={total}
              className="cart-pop text-3xl font-bold tabular-nums"
            >
              {inr(total)}
            </span>
          </div>

          <p className="mt-4 rounded-lg bg-[#0047AB] px-3 py-2.5 text-center text-sm font-medium">
            You save {inr(discount)} on this order
          </p>

          {hasUnavailable && (
            <p className="mt-4 text-center text-sm text-red-400">
              Remove unavailable items to continue.
            </p>
          )}

          <button
            disabled={hasUnavailable}
            className="mt-6 w-full rounded-xl bg-white py-3.5 text-base font-semibold text-black transition duration-200 hover:bg-[#0047AB] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
          >
            Proceed to checkout
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;