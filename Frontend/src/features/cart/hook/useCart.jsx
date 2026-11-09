import { useEffect } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import {
  addGuestCartItem,
  clearGuestCart,
  removeGuestCartItem,
  removeSyncedGuestItems,
  updateGuestCartItem,
} from "../state/cartSlice";

import {
  addToCartApi,
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from "../api/cart.api";

let guestSyncPromise = null;

const useCart = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const isAuthenticate = useSelector(
    (state) => state.auth.isAuthenticate
  );

  const guestItems = useSelector((state) => state.cart.items);

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: getCartApi,
    enabled: isAuthenticate,
    retry: false,
  });

  const refreshCart = () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] });

  const addMutation = useMutation({
    mutationFn: addToCartApi,
    onSuccess: refreshCart,
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItemApi,
    onSuccess: refreshCart,
  });

  const clearMutation = useMutation({
    mutationFn: clearCartApi,
    onSuccess: refreshCart,
  });

  const updateMutation = useMutation({
    mutationFn: updateCartItemApi,
    onSuccess: refreshCart,
  });

  useEffect(() => {
    if (!isAuthenticate || !guestItems.length || guestSyncPromise) {
      return;
    }

    const itemsToSync = [...guestItems];

    guestSyncPromise = Promise.all(
      itemsToSync.map((item) =>
        addToCartApi({
          productId: item.product._id,
          size: item.size,
          quantity: item.quantity,
        })
      )
    )
      .then(() => {
        dispatch(
          removeSyncedGuestItems(itemsToSync.map((item) => item._id))
        );
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      })
      .catch((error) => {
        console.error("Guest cart sync failed:", error);
      })
      .finally(() => {
        guestSyncPromise = null;
      });

    return () => {};
  }, [isAuthenticate, guestItems, dispatch, queryClient]);

  const addToCart = (payload, callbacks = {}) => {
    if (isAuthenticate) {
      addMutation.mutate(payload, callbacks);
      return;
    }

    dispatch(
      addGuestCartItem({
        product: payload.product,
        size: payload.size,
        quantity: payload.quantity ?? 1,
        availableStock: payload.availableStock,
      })
    );

    callbacks.onSuccess?.();
  };

  const removeCartItem = (itemId, callbacks = {}) => {
    if (isAuthenticate) {
      removeMutation.mutate(itemId, callbacks);
      return;
    }

    dispatch(removeGuestCartItem(itemId));
    callbacks.onSuccess?.();
  };

  const updateCartItem = (payload, callbacks = {}) => {
    if (isAuthenticate) {
      updateMutation.mutate(payload, callbacks);
      return;
    }

    dispatch(updateGuestCartItem(payload));
    callbacks.onSuccess?.();
    callbacks.onSettled?.();
  };

  const clearCart = (_, callbacks = {}) => {
    if (isAuthenticate) {
      clearMutation.mutate(undefined, callbacks);
      return;
    }

    dispatch(clearGuestCart());
    callbacks.onSuccess?.();
    callbacks.onSettled?.();
  };

  const serverItems =
    query.data?.data?.cart?.products ??
    query.data?.cart?.products ??
    [];

  return {
    addToCart,
    isAddingToCart: addMutation.isPending,
    addToCartError: addMutation.error,

    getCartItems: isAuthenticate ? serverItems : guestItems,
    fetchingCartItems: isAuthenticate && query.isPending,
    fetchCartItemsError: query.error,

    removeCartItem,
    cartItemRemoving: removeMutation.isPending,
    cartItemRemoveError: removeMutation.error,

    clearCart,
    isClearingCart: clearMutation.isPending,
    clearCartError: clearMutation.error,

    updateCartItem,
    isUpdatingCartItem: updateMutation.isPending,
  };
};

export default useCart;