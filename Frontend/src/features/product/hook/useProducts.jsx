import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProductApi,
  allProductApi,
  deleteProductApi,
  editProductApi,
  getAllSellerProductsApi,
  listingProductApi,
  productDetailApi,
} from "../api/product.api";

const useProduct = () => {
  const queryClient = useQueryClient();

  // Product badalne par list aur detail dono ka cache refresh
  const refreshProducts = () => {
    queryClient.invalidateQueries({ queryKey: ["AllProducts"] });
    queryClient.invalidateQueries({ queryKey: ["SellerProducts"] });
    queryClient.invalidateQueries({ queryKey: ["productDetail"] });
  };

  const getAllProductsQuery = useQuery({
    queryKey: ["AllProducts"],
    queryFn: allProductApi,
  });

  const getAllSellerProductsQuery = useQuery({
    queryKey: ["SellerProducts"],
    queryFn: getAllSellerProductsApi,
  });

  const addProductMutation = useMutation({
    mutationFn: addProductApi,
    onSuccess: refreshProducts,
  });

  const listingProductMutation = useMutation({
    mutationFn: listingProductApi,
    onSuccess: refreshProducts,
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: refreshProducts,
  });

  const editProductMutation = useMutation({
    mutationFn: editProductApi,
    onSuccess: refreshProducts,
  });

  return {
    allproducts: getAllProductsQuery.data?.data?.product ?? [],
    fetchingProducts: getAllProductsQuery.isPending,
    productsFetchError: getAllProductsQuery.error,

    addProduct: addProductMutation.mutate,
    productAdding: addProductMutation.isPending,
    addProductError: addProductMutation.error,

    allSellerProducts: getAllSellerProductsQuery.data?.data?.product ?? [],
    fetchingSellerProducts: getAllSellerProductsQuery.isPending,
    sellerProductsFetchError: getAllSellerProductsQuery.error,

    listingProduct: listingProductMutation.mutate,
    isListingProduct: listingProductMutation.isPending,
    listingProductError: listingProductMutation.error,

    deleteProduct: deleteProductMutation.mutate,
    productDeleting: deleteProductMutation.isPending,
    deleteProductError: deleteProductMutation.error,

    editProduct: editProductMutation.mutate,
    productUpdating: editProductMutation.isPending,
    productUpdateError: editProductMutation.error,
  };
};

/* ------------------------------------------------------------------
   useProductDetail(id)  ->  ek product ki detail
   Product detail page me use hota hai: const { id } = useParams();
   (id ke bina query chalti hi nahi, aur har id ka alag cache banta hai)
------------------------------------------------------------------- */
export const useProductDetail = (id) => {
  const query = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => productDetailApi(id),
    enabled: !!id,
    // 404 par retry mat karo
    retry: (count, error) => error?.response?.status !== 404 && count < 1,
  });

  return {
    // backend: { message, product }
    // productDetailApi poora axios response de to data.data.product, warna data.product
    product: query.data?.data?.product ?? query.data?.product ?? null,
    fetchingProduct: query.isLoading,
    productError: query.error,
  };
};

export default useProduct;