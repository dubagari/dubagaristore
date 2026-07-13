import { useMemo, useEffect } from "react";
import { selectAllProducts } from "../redux/slices/productsSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { selectAllOrders } from "../redux/slices/ordersSlice.js";
import { selectUser, selectUsers } from "../redux/slices/userSlice.js";
import {
  DollarSign,
  ShoppingBag,
  Users,
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
  Percent,
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import Table from "../components/ui/Table";
import RevenueChart from "../components/charts/RevenueChart";
import SalesChart from "../components/charts/SalesChart";

import { setActiveTab } from "../redux/slices/navigationSlice";
import { fetchOrders } from "../redux/slices/orderThunks.js";
import { fetchProducts } from "../redux/slices/productsThunk.js";
import { fetchUsers } from "../redux/slices/userThunk.js";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const Dashboard = () => {
  const dispatch = useDispatch();
  const allOrders = useSelector(selectAllOrders) || [];
  const loggedInUser = useSelector(selectUser);
  const allUsers = useSelector(selectUsers) || [];
  const allProducts = useSelector(selectAllProducts) || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const dashboardStats = useMemo(() => {
    const totalRevenue = allOrders.reduce(
      (sum, order) => sum + Number(order?.totalPrice ?? 0),
      0
    );

    const completedOrders = allOrders.filter(
      (order) => order.status === "completed" || order.status === "Completed",
    ).length;

    const pendingOrders = allOrders.filter(
      (order) => order.status === "pending" || order.status === "Pending",
    ).length;

    const totalUser = allUsers.length;

    const conversionRate = totalUser
      ? ((completedOrders / totalUser) * 100).toFixed(2)
      : "0.00";

    return {
      totalRevenue,
      completedOrders,
      pendingOrders,
      totalUser,
      conversionRate,
    };
  }, [allOrders, allUsers]);

  // Revenue by month for RevenueChart
  const revenueChartData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
      return { month: d.getMonth(), year: d.getFullYear(), name: MONTH_NAMES[d.getMonth()], revenue: 0, expenses: 0 };
    });
    allOrders.forEach((order) => {
      if (!order.createdAt) return;
      const d = new Date(order.createdAt);
      const slot = months.find((m) => m.month === d.getMonth() && m.year === d.getFullYear());
      if (slot) {
        slot.revenue += Number(order.totalPrice ?? 0);
        slot.expenses += Number(order.shippingPrice ?? 0) + Number(order.taxPrice ?? 0);
      }
    });
    return months.map(({ name, revenue, expenses }) => ({ name, revenue: Math.round(revenue), expenses: Math.round(expenses) }));
  }, [allOrders]);

  // Category breakdown for SalesChart
  const categoryChartData = useMemo(() => {
    const map = {};
    allProducts.forEach((p) => {
      const cat = p.category || "Other";
      map[cat] = (map[cat] || 0) + Number(p.price ?? 0) * Number(p.stock ?? 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [allProducts]);

  const recentOrders = useMemo(() => {
    return allOrders.slice(0, 5).map((order) => ({
      id: order?._id?.slice(-6) || "N/A",
      customer: order?.user?.name || "Guest",
      product:
        order?.orderItems?.[0]?.name ||
        order?.orderItems?.[0]?.product?.name ||
        "Multiple Items",
      date: order?.createdAt
        ? new Date(order.createdAt).toLocaleDateString()
        : "N/A",
      amount: `$${Number(order?.totalPrice ?? 0).toFixed(2)}`,
      status:
        order?.status
          ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
          : "Pending",
    }));
  }, [allOrders]);
  
  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
    dispatch(fetchUsers());
  }, [dispatch]);

  const ordersLoading = useSelector((state) => state.orders.loading);

  if (ordersLoading) {
    return (
      <div className="text-center font-bold text-slate-400 animate-pulse py-10">
        Loading dashboard...
      </div>
      
    );
  }

  const columns = [
    {
      key: "id",
      header: "Order ID",
    },
    {
      key: "customer",
      header: "Customer",
    },
    {
      key: "product",
      header: "Product",
    },
    {
      key: "date",
      header: "Date",
    },
    {
      key: "amount",
      header: "Amount",
    },
    {
      key: "status",
      header: "Status",
    },
  ];
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-lg">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5" />
            System Secure & Active
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting}, {loggedInUser?.name || "Admin"}!
          </h2>
          <p className="text-sm text-purple-200 leading-relaxed">
            You currently have{" "}
            <span className="font-bold text-white">
              {dashboardStats.pendingOrders}
            </span>{" "}
            pending orders requiring fulfillment.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/8">
          <ShoppingCart className="h-64 w-64" />
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Earnings"
          value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
          change="+12.5%"
          changeText="Total revenue generated"
          trend="up"
          icon={DollarSign}
        />

        <StatCard
          title="Orders Fulfilled"
          value={dashboardStats.completedOrders}
          change={`${dashboardStats.pendingOrders} pending`}
          changeText="Completed orders"
          trend="up"
          icon={ShoppingBag}
        />

        <StatCard
          title="Active Customers"
          value={dashboardStats.totalUser}
          change="+0%"
          changeText="Registered customers"
          trend="up"
          icon={Users}
        />

        <StatCard
          title="Conversion Rate"
          value={`${dashboardStats.conversionRate}%`}
          change="+0%"
          changeText="Orders per customer"
          trend="up"
          icon={Percent}
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 min-w-0">
          <RevenueChart data={revenueChartData} />
        </div>

        <div className="min-w-0">
          <SalesChart data={categoryChartData.length ? categoryChartData : undefined} />
        </div>
      </div>

      {/* Recent Orders log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Recent Orders
            </h3>
            <p className="text-xs text-slate-450">
              Review and dispatch newly placed buyer orders
            </p>
          </div>
          <button
            onClick={() => dispatch(setActiveTab("orders"))}
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-650 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-355 transition-colors"
          >
            Manage all orders
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <Table columns={columns} data={recentOrders} itemsPerPage={5} />
      </div>
    </div>
  );
}

export default Dashboard;