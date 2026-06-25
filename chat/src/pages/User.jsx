import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Users,
  Search,
  Mail,
  Calendar,
  DollarSign,
  Award,
  Grid,
  List,
  Eye,
  X,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Table from "../components/ui/Table.jsx";
import { selectUsers } from "../redux/slices/userSlice.js";
import { selectAllOrders } from "../redux/slices/ordersSlice.js";
import { fetchUsers } from "../redux/slices/userThunk.js";
import { fetchOrders } from "../redux/slices/orderThunks.js";

const User = () => {
  const dispatch = useDispatch();

  // Redux state
  const allUsers = useSelector(selectUsers) || [];
  const allOrders = useSelector(selectAllOrders) || [];

  // Local UI state (no need for redux for this simple page state)
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchOrders());
  }, [dispatch]);

  // Build per-user order stats from the orders slice
  const userOrderStats = useMemo(() => {
    const map = {}; // userId -> { count, spent, lastOrder }
    allOrders.forEach((order) => {
      const uid = order.user?._id || order.user;
      if (!uid) return;
      const id = typeof uid === "object" ? uid.toString() : uid;
      if (!map[id]) map[id] = { count: 0, spent: 0 };
      map[id].count += 1;
      map[id].spent += Number(order.totalPrice ?? 0);
    });
    return map;
  }, [allOrders]);

  // Map users to flat CRM row shape
  const customers = useMemo(() => {
    return allUsers.map((u) => {
      const stats = userOrderStats[u._id] || { count: 0, spent: 0 };
      return {
        _id: u._id,
        id: u._id?.slice(-6) || "N/A",
        name: u.name || "Unknown",
        email: u.email || "—",
        role: u.role || "customer",
        avatar:
          u.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=a855f7&color=fff&bold=true`,
        joined: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
        orders: stats.count,
        spent: stats.spent,
        status: stats.count > 0 ? "Active" : "Inactive",
      };
    });
  }, [allUsers, userOrderStats]);

  // Search filter
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q),
    );
  }, [customers, searchQuery]);

  // CRM summary stats
  const crmStats = useMemo(() => {
    const totalRevenue = customers.reduce((s, c) => s + c.spent, 0);
    const activeCount = customers.filter((c) => c.status === "Active").length;
    const avgLTV = customers.length ? totalRevenue / customers.length : 0;
    const vipCount = customers.filter((c) => c.spent > 500).length;
    return { total: customers.length, avgLTV, activeCount, vipCount };
  }, [customers]);

  const columns = [
    {
      key: "name",
      header: "Customer",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.name}
            className="h-8 w-8 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {row.name}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">#{row.id}</p>
          </div>
        </div>
      ),
    },
    { key: "email", header: "Email Address" },
    { key: "joined", header: "Joined Date" },
    {
      key: "orders",
      header: "Orders",
      render: (row) => (
        <span className="font-semibold">{row.orders} orders</span>
      ),
    },
    {
      key: "spent",
      header: "Total Billing",
      render: (row) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          ${row.spent.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const isActive = row.status === "Active";
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isActive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Profile",
      sortable: false,
      render: (row) => (
        <button
          onClick={() => setSelectedCustomer(row)}
          className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View CRM
        </button>
      ),
    },
  ];

  return (
    <div className="relative space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
          Client CRM Dashboard
        </h2>
        <p className="text-sm text-slate-450">
          Track customer spending, order history, and account activity
        </p>
      </div>

      {/* CRM Live Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400">CRM Contacts</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {crmStats.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400">Avg. Lifetime Value</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              ${crmStats.avgLTV.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400">Active Buyers</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {crmStats.activeCount}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 flex items-center justify-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400">VIP Customers</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {crmStats.vipCount} VIPs
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-xs outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-purple-400"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "table"
                ? "bg-white text-purple-600 shadow-sm dark:bg-slate-800 dark:text-purple-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-white text-purple-600 shadow-sm dark:bg-slate-800 dark:text-purple-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
            title="Card Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filteredCustomers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Users className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm font-semibold">No customers found</p>
          <p className="text-xs mt-1">
            {searchQuery ? "Try a different search term" : "No registered users yet"}
          </p>
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && filteredCustomers.length > 0 && (
        <Table
          columns={columns}
          data={filteredCustomers}
          itemsPerPage={8}
        />
      )}

      {/* Grid Card View */}
      {viewMode === "grid" && filteredCustomers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((cust) => (
            <div
              key={cust._id}
              onClick={() => setSelectedCustomer(cust)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  <img
                    src={cust.avatar}
                    alt={cust.name}
                    className="h-11 w-11 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-150 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-sm">
                      {cust.name}
                    </h4>
                    <p className="text-[10px] text-slate-450">{cust.email}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                    cust.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {cust.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 text-xs font-semibold">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    Orders
                  </span>
                  <span className="text-slate-700 dark:text-slate-250">
                    {cust.orders} purchases
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    Total Spent
                  </span>
                  <span className="font-extrabold text-purple-600 dark:text-purple-400">
                    ${cust.spent.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}

      {/* CRM Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedCustomer(null)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <div className="relative w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-950 flex flex-col h-full overflow-y-auto border-l border-slate-200 dark:border-slate-800 animate-slideLeft">
            {/* Close */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Profile Intro */}
            <div className="flex flex-col items-center text-center py-5 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-purple-500/20"
              />
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {selectedCustomer.name}
                </h3>
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold uppercase tracking-widest mt-0.5">
                  {selectedCustomer.spent > 500 ? "VIP Customer" : selectedCustomer.role}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-450">
                <Calendar className="h-3.5 w-3.5" />
                <span>Member since {selectedCustomer.joined}</span>
              </div>
            </div>

            {/* Lifetime stats */}
            <div className="py-5 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Total Spent
                </span>
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-150">
                  ${selectedCustomer.spent.toFixed(2)}
                </span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Orders Placed
                </span>
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-150">
                  {selectedCustomer.orders}
                </span>
              </div>
            </div>

            {/* Orders for this customer */}
            <div className="py-5 border-b border-slate-100 dark:border-slate-800 space-y-3 flex-1">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="h-3.5 w-3.5" />
                Order History
              </h4>
              {allOrders
                .filter((o) => {
                  const uid = o.user?._id || o.user;
                  return uid === selectedCustomer._id || uid?.toString() === selectedCustomer._id;
                })
                .slice(0, 5)
                .map((order, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs font-semibold bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2.5"
                  >
                    <div>
                      <p className="text-slate-700 dark:text-slate-200">
                        #{order._id?.slice(-6)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {order.orderItems?.[0]?.name || "Multiple items"} ·{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800 dark:text-slate-100">
                        ${Number(order.totalPrice ?? 0).toFixed(2)}
                      </p>
                      <span
                        className={`text-[10px] font-bold capitalize ${
                          order.status === "delivered" || order.status === "completed"
                            ? "text-emerald-500"
                            : order.status === "cancelled"
                            ? "text-rose-500"
                            : "text-amber-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              {allOrders.filter((o) => {
                const uid = o.user?._id || o.user;
                return uid === selectedCustomer._id || uid?.toString() === selectedCustomer._id;
              }).length === 0 && (
                <p className="text-xs text-slate-400 py-2">No orders found for this customer.</p>
              )}
            </div>

            {/* Contact info */}
            <div className="py-5 border-b border-slate-100 dark:border-slate-800 space-y-3 text-xs font-semibold">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact</h4>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600 dark:text-slate-350">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600 dark:text-slate-350">ID: #{selectedCustomer.id}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-5 space-y-3">
              <a
                href={`mailto:${selectedCustomer.email}`}
                className="w-full h-10 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all flex items-center justify-center gap-1.5 text-xs font-bold shadow-md shadow-purple-500/20"
              >
                <MessageSquare className="h-4 w-4" />
                Send Email Message
              </a>
              <button className="w-full h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 transition-all text-xs font-bold">
                Restrict Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
