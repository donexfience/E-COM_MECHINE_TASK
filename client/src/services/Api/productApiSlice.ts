import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../baseQuery";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: "/product",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    addProduct: builder.mutation({
      query: (formData) => ({
        url: "/product",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        try {
          const { data: newProduct } = await queryFulfilled;
          
          dispatch(
            productApi.util.updateQueryData('getProducts', {}, (draft) => {
              if (draft?.products) {
                draft.products.push(newProduct);
              }
            })
          );
        } catch {
        }
      },
    }),

    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted({ id, formData }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProduct } = await queryFulfilled;
          dispatch(
            productApi.util.updateQueryData('getProducts', {}, (draft) => {
              if (draft?.products) {
                const index = draft.products.findIndex((product: any) => product._id === id);
                if (index !== -1) {
                  draft.products[index] = updatedProduct;
                }
              }
            })
          );
        } catch {
        }
      },
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productApi.util.updateQueryData('getProducts', {}, (draft) => {
            if (draft?.products) {
              draft.products = draft.products.filter((product: any) => product._id !== id);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;