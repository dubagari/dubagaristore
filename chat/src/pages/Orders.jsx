import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingBag,
  Search,
  Eye,
  Filter,
  ArrowRight,
  X,
  User,
  MapPin,
  CreditCard,
  ShoppingCart,
  Truck,
  ClipboardList,
  CheckCircle,
} from "lucide-react";
import Table from "../components/ui/Table";
import {
  selectAllOrders,
  selectFilteredOrders,
  selectMappedOrders,
  selectOrderSearchQuery,
  selectOrderSortDirection,
  selectSelectedOrder,
  selectOrderSortKey,
  selectOrderStatusFilter,
  selectOrdersError,
  selectOrdersLoading,
  setSearchQuery,
  setSorting,
  setStatusFilter,
  setSelectedOrder,
} from "../redux/slices/ordersSlice.js";
import { updateOrderStatus, fetchOrders } from "../redux/slices/orderThunks.js";

export default function Orders() {
  const dispatch = useDispatch();

  // Selectors
  const filteredOrders = useSelector(selectMappedOrders);
  const searchQuery = useSelector(selectOrderSearchQuery);
  const statusFilter = useSelector(selectOrderStatusFilter);
  const sortKey = useSelector(selectOrderSortKey);
  const sortDirection = useSelector(selectOrderSortDirection);
  const selectedOrder = useSelector(selectSelectedOrder);

  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();
    } catch (err) {
      alert(err || "Failed to update order status");
    }
  };

  const handleSortClick = (key) => {
    dispatch(setSorting(key));
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const columns = [
    {
      key: "id",
      header: "Order ID",
      render: (row) => (
        <span className="font-bold text-slate-800 dark:text-slate-205">
          {row.id}
        </span>
      ),
    },
    { key: "customer", header: "Customer" },
    { key: "product", header: "Product" },
    { key: "date", header: "Date" },
    {
      key: "amount",
      header: "Amount",
      render: (row) => <span>${parseFloat(row.amount).toFixed(2)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        let colors =
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        if (row.status === "Completed")
          colors =
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
        else if (row.status === "Processing")
          colors =
            "bg-blue-50 text-blue-750 dark:bg-blue-950/40 dark:text-blue-400";
        else if (row.status === "Pending")
          colors =
            "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
        else if (row.status === "Cancelled")
          colors =
            "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450";

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Details",
      sortable: false,
      render: (row) => (
        <button
          onClick={() => dispatch(setSelectedOrder(row))}
          className="inline-flex items-center gap-1 text-xs font-bold text-purple-650 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </button>
      ),
    },
  ];

  const getStepStatus = (orderStatus, step) => {
    const normalized = orderStatus?.toLowerCase() || "";
    const states = ["pending", "processing", "shipped", "delivered"];
    if (normalized === "cancelled") return "error";

    const currentIdx = states.indexOf(normalized);
    const stepIdx = states.indexOf(step.toLowerCase());

    if (currentIdx >= stepIdx) return "done";
    return "pending";
  };

  return (
    <div className="relative space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
          Order Management
        </h2>
        <p className="text-sm text-slate-450">
          Review billing summaries, track deliveries, and manage status
          lifecycles
        </p>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by customer, product, order ID..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-xs outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-purple-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          {["All", "Pending", "Processing", "Completed", "Cancelled"].map(
            (tabName) => (
              <button
                key={tabName}
                onClick={() => dispatch(setStatusFilter(tabName))}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === tabName
                    ? "bg-white text-purple-650 shadow-sm dark:bg-slate-800 dark:text-purple-400"
                    : "text-slate-505 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {tabName}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Orders Table */}
      <Table
        columns={columns}
        data={filteredOrders}
        itemsPerPage={5}
        onSort={handleSortClick}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />

      {/* Dynamic Right Sidebar Drawer Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => dispatch(setSelectedOrder(null))}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          {/* Drawer Box */}
          <div className="relative w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-950 flex flex-col h-full overflow-y-auto border-l border-slate-200 dark:border-slate-850 animate-slideLeft">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-850">
              <div>
                <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                  Order Details
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => dispatch(setSelectedOrder(null))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-605 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Stepper Tracking Indicator */}
            <div className="py-6 border-b border-slate-100 dark:border-slate-850">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                Order Progress
              </h4>
              <div className="relative flex flex-col gap-6 pl-6 border-l border-slate-200 dark:border-slate-800">
                {/* Step 1 - Pending */}
                <div className="relative flex items-start">
                  <span
                    className={`absolute -left-8.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ring-4 ring-white dark:ring-slate-950 ${
                      getStepStatus(selectedOrder.status, "pending") === "done"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    1
                  </span>
                  <div className="text-xs font-semibold">
                    <p className="text-slate-700 dark:text-slate-200">
                      Order Placed &amp; Pending
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Order verification successful
                    </p>
                  </div>
                </div>

                {/* Step 2 - Processing */}
                <div className="relative flex items-start">
                  <span
                    className={`absolute -left-8.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ring-4 ring-white dark:ring-slate-950 ${
                      getStepStatus(selectedOrder.status, "processing") === "done"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    2
                  </span>
                  <div className="text-xs font-semibold">
                    <p className="text-slate-700 dark:text-slate-200">
                      Fulfillment Processing
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Stock allocated and packaging
                    </p>
                  </div>
                </div>

                {/* Step 3 - Shipped */}
                <div className="relative flex items-start">
                  <span
                    className={`absolute -left-8.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ring-4 ring-white dark:ring-slate-950 ${
                      getStepStatus(selectedOrder.status, "shipped") === "done"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    3
                  </span>
                  <div className="text-xs font-semibold">
                    <p className="text-slate-700 dark:text-slate-200">
                      Shipped &amp; Dispatched
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Package handed to courier
                    </p>
                  </div>
                </div>

                {/* Step 4 - Delivered */}
                <div className="relative flex items-start">
                  <span
                    className={`absolute -left-8.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ring-4 ring-white dark:ring-slate-950 ${
                      getStepStatus(selectedOrder.status, "delivered") === "done"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    4
                  </span>
                  <div className="text-xs font-semibold">
                    <p className="text-slate-700 dark:text-slate-200">
                      Delivered &amp; Completed
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Package received by customer
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Customer info */}
            <div className="py-5 border-b border-slate-100 dark:border-slate-850 space-y-4 text-xs font-semibold">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Buyer Information
              </h4>
              <div className="flex gap-3">
                <User className="h-5 w-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-slate-700 dark:text-slate-250">
                    {selectedOrder.customer}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {selectedOrder.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-slate-600 dark:text-slate-355 leading-relaxed">
                  {selectedOrder.shipping}
                </p>
              </div>
              <div className="flex gap-3">
                <CreditCard className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-slate-650 dark:text-slate-350">
                  {selectedOrder.payment}
                </p>
              </div>
            </div>

            {/* Order Items list */}
            <div className="py-5 border-b border-slate-100 dark:border-slate-850 flex-1 space-y-3">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Line Items
              </h4>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-xs font-semibold"
                  >
                    <div>
                      <p className="text-slate-750 dark:text-slate-200">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <span className="text-slate-800 dark:text-slate-100">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Action Buttons */}
            <div className="pt-6 space-y-4 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Total Bill:</span>
                <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                  ${parseFloat(selectedOrder.amount).toFixed(2)}
                </span>
              </div>

              {/* Status dispatch action buttons */}
              {selectedOrder.status !== "Completed" &&
                selectedOrder.status !== "completed" &&
                selectedOrder.status !== "Cancelled" &&
                selectedOrder.status !== "cancelled" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedOrder._id, "cancelled")
                      }
                      className="h-10 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:hover:bg-rose-950/20 transition-all"
                    >
                      Cancel Order
                    </button>
                    {selectedOrder.status === "Pending" ||
                    selectedOrder.status === "pending" ? (
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedOrder._id, "processing")
                        }
                        className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5"
                      >
                        <ClipboardList className="h-4 w-4" />
                        Start Processing
                      </button>
                    ) : selectedOrder.status === "Processing" || selectedOrder.status === "processing" ? (
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedOrder._id, "shipped")
                        }
                        className="h-10 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Truck className="h-4 w-4" />
                        Mark as Shipped
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedOrder._id, "delivered")
                        }
                        className="h-10 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Complete Delivery
                      </button>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
