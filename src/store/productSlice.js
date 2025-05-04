import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  categories: [],
  pagination: {
    currentPage: 1,
    itemsPerPage: 6,
    totalItems: 0,
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.pagination.totalItems = action.payload.length;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetPagination: (state) => {
      state.pagination.currentPage = 1;
    },
  },
});

export const { setProducts, setCategories, setCurrentPage, resetPagination } = productSlice.actions;
export const selectPaginatedProducts = (state, selectedCategories) => {
  const { products, pagination } = state.products;
  const { currentPage, itemsPerPage } = pagination;

  const filteredProducts = selectedCategories.includes("All") ? products : products.filter((product) => selectedCategories.includes(product.category.name));
  const startIndex = 0;
  const endIndex = currentPage * itemsPerPage;

  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    products: currentProducts,
    hasMore: endIndex < filteredProducts.length,
    totalItems: filteredProducts.length,
    filteredProducts,
  };
};

export default productSlice.reducer;
