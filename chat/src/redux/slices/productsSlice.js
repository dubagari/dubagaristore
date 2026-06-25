import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  fetchProducts,
  createProduct,
  removeProduct,
  updateProduct,
} from "./productsThunk";

const initialState = {
  items: [],
  searchQuery: "",
  statusFilter: "All",
  sortKey: null,
  sortDirection: "asc",

  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    deleteProduct: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },

    setSorting: (state, action) => {
      const key = action.payload;

      if (state.sortKey === key) {
        if (state.sortDirection === "asc") {
          state.sortDirection = "desc";
        } else {
          state.sortKey = null;
          state.sortDirection = "asc";
        }
      } else {
        state.sortKey = key;
        state.sortDirection = "asc";
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const selectProductsLoading = (state) => state.products.loading;

export const selectProductsError = (state) => state.products.error;

export const selectProductsState = (state) => state.products;

const selectItemsBase = (state) =>
  Array.isArray(state.products?.items) ? state.products.items : [];

export const selectAllProducts = createSelector([selectItemsBase], (items) =>
  items.map((item) => {
    let status = "In Stock";
    if (item.stock === 0) status = "Out of Stock";
    else if (item.stock <= 10) status = "Low Stock";
    return { ...item, status };
  })
);

export const selectSearchQuery = (state) => state.products?.searchQuery;

export const selectStatusFilter = (state) => state.products?.statusFilter;

export const selectSortKey = (state) => state.products?.sortKey;

export const selectSortDirection = (state) => state.products?.sortDirection;

export const selectFilteredProducts = createSelector(
  [
    selectAllProducts,
    selectSearchQuery,
    selectStatusFilter,
    selectSortKey,
    selectSortDirection,
  ],
  (items, query, filter, sortKey, sortDirection) => {
    let result = items.filter((prod) => {
      if (filter !== "All" && prod.status !== filter) {
        return false;
      }

      if (query) {
        const q = query.toLowerCase().trim();

        return (
          prod.name?.toLowerCase().includes(q) ||
          prod.category?.toLowerCase().includes(q) ||
          (prod._id || "").toLowerCase().includes(q)
        );
      }

      return true;
    });

    if (sortKey) {
      result = [...result].sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) {
          return sortDirection === "asc" ? -1 : 1;
        }

        if (aVal > bVal) {
          return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
      });
    }

    return result;
  },
);

export const selectProductsStats = createSelector(
  [selectAllProducts],
  (items) => ({
    total: items.length,
    inStock: items.filter((item) => item.status === "In Stock").length,
    lowStock: items.filter((item) => item.status === "Low Stock").length,
    outOfStock: items.filter((item) => item.status === "Out of Stock").length,
  }),
);

export const { deleteProduct, setSearchQuery, setStatusFilter, setSorting } =
  productsSlice.actions;

export default productsSlice.reducer;
