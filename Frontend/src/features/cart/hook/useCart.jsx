import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCartApi,
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from "../api/cart.api";

const useCart = () => {
  const queryClient = useQueryClient();

  const refreshCart = () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] });

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: getCartApi,
  });

  const addMutation = useMutation({
    mutationFn: addToCartApi,
    onSuccess: refreshCart,
  });

  const removeItemMutation = useMutation({
    mutationFn: removeCartItemApi,
    onSuccess: refreshCart,
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCartApi,
    onSuccess: refreshCart,
  });
  const updateItemMutation = useMutation({
    mutationFn: updateCartItemApi,
    onSuccess: refreshCart,
  });

  
  return {
    addToCart: addMutation.mutate,
    isAddingToCart: addMutation.isPending,
    addToCartError: addMutation.error,

    getCartItems: query.data,
    fetchingCartItems: query.isPending,
    fetchCartItemsError: query.error,

    removeCartItem: removeItemMutation.mutate,
    cartItemRemoving: removeItemMutation.isPending,
    cartItemRemoveError: removeItemMutation.error,

    clearCart: clearCartMutation.mutate,
    isClearingCart: clearCartMutation.isPending,
    clearCartError: clearCartMutation.error,

updateCartItem: updateItemMutation.mutate,
isUpdatingCartItem: updateItemMutation.isPending,
  };
};

export default useCart;
