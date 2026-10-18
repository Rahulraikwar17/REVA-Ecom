import api from "../../../config/api";

export const allProductApi = async () => {
  const res = await api.get("/products");
  console.log(res);
  return res.data;
};

export const getAllSellerProductsApi = async () => {
  const res = await api.get("/products/seller");
  console.log(res.data);
  return res.data;
};

export const addProductApi = async (data) => {
  const res = await api.post("/products", data);

  return res.data;
};

export const listingProductApi = async ({ id, data }) => {
  console.log(data);
  const res = await api.patch(`/products/listing/${id}`, data);

  return res.data;
};

export const editProductApi = async ({ id, data }) => {
  const res = await api.patch(`products/edit-product/${id}`, data);

  return res.data;
};

export const deleteProductApi = async (id) => {
  const res = await api.delete(`/products/product-delete/${id}`);
  return res.data;
};

export const productDetailApi = async (id) => {
  const res = await api.get(`/products/product-detail/${id}`);
  return res.data;
};
