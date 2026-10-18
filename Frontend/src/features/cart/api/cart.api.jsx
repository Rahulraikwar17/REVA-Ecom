import api from "../../../config/api";

export const addToCartApi = async ({ productId, size, quantity = 1 }) => {
  const res = await api.post("/cart", { productId, size, quantity });
  return res.data;
};

export const getCartApi = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const updateCartItemApi = async ({ itemId, quantity }) => {
  const res = await api.patch(`/cart/${itemId}`, { quantity });
  return res.data;
};

export const removeCartItemApi = async (itemId) => {
  const res = await api.delete(`/cart/${itemId}`);
  return res.data;
};

export const clearCartApi = async () => {
  const res = await api.delete("/cart");
  return res.data;
};