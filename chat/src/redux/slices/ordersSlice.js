import { createSlice, createSelector } from "@reduxjs/toolkit";
import { fetchOrders, createOrder, updateOrderStatus } from "./orderThunks.js";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  searchQuery: "",
  statusFilter: "All",
  sortKey: null,
  sortDirection: "asc",
  selectedOrder: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },

    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
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
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload.data);
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        if (!action.payload) return;
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

// Actions
export const { setSearchQuery, setStatusFilter, setSorting, setSelectedOrder } =
  ordersSlice.actions;

// Base selectors
export const selectAllOrders = (state) => state.orders?.orders ?? [];

export const selectOrdersLoading = (state) => state.orders?.loading ?? false;

export const selectOrdersError = (state) => state.orders?.error ?? null;

export const selectOrderSearchQuery = (state) =>
  state.orders?.searchQuery ?? "";

export const selectOrderStatusFilter = (state) =>
  state.orders?.statusFilter ?? "All";

export const selectOrderSortKey = (state) => state.orders?.sortKey ?? null;

export const selectOrderSortDirection = (state) =>
  state.orders?.sortDirection ?? "asc";

export const selectSelectedOrder = (state) =>
  state.orders?.selectedOrder ?? null;

// Memoized filtered selector
export const selectFilteredOrders = createSelector(
  [
    selectAllOrders,
    selectOrderSearchQuery,
    selectOrderStatusFilter,
    selectOrderSortKey,
    selectOrderSortDirection,
  ],
  (orders, query, filter, sortKey, sortDirection) => {
    let result = orders.filter((order) => {
      // Map UI filter to backend status
      let mappedFilter = filter.toLowerCase();
      if (mappedFilter === "completed") mappedFilter = "delivered";

      // Treat 'shipped' as part of the 'Processing' filter tab since there is no 'Shipped' tab
      const matchesStatus =
        filter === "All" ||
        order.status === mappedFilter ||
        (filter === "Processing" && order.status === "shipped");

      const q = query.toLowerCase().trim();

      const matchesSearch =
        !q ||
        order._id?.toLowerCase().includes(q) ||
        order.user?.name?.toLowerCase().includes(q) ||
        order.user?.email?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
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

// Maps raw DB orders → flat table row shape
export const selectMappedOrders = createSelector(
  [selectFilteredOrders],
  (orders) =>
    orders.map((order) => ({
      _id: order._id,
      id: order._id?.slice(-6) || "N/A",
      customer: order.user?.name || "Guest",
      email: order.user?.email || "",
      product:
        order.orderItems?.[0]?.name ||
        order.orderItems?.[0]?.product?.name ||
        "Multiple Items",
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString()
        : "N/A",
      amount: Number(order.totalPrice ?? 0),
      shipping: order.shippingAddress
        ? `${order.shippingAddress.address}, ${order.shippingAddress.city}`
        : "N/A",
      payment: order.paymentMethod || "N/A",
      status:
        order.status === "delivered"
          ? "Completed"
          : order.status.charAt(0).toUpperCase() + order.status.slice(1),
      items: order.orderItems?.map((item) => ({
        name: item.name || item.product?.name || "Unknown",
        qty: item.quantity,
        price: Number(item.price ?? 0),
      })),
    }))
);

export default ordersSlice.reducer;
