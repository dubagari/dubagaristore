import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUsers } from "../../redux/slices/userSlice";
import {
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Info,
  ShoppingBag,
} from "lucide-react";
import { toggleDarkMode, setActiveTab } from "../../redux/slices/navigationSlice";
import { setSearchQuery as setProductSearch } from "../../redux/slices/productsSlice";
import { setSearchQuery as setOrderSearch, setSelectedOrder } from "../../redux/slices/ordersSlice";


export default function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.navigation.activeTab);
  const darkMode = useSelector((state) => state.navigation.darkMode);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const storedUser = localStorage.getItem("adminUser");

  const adminUser =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  const [user] = useState(adminUser);

  const products = useSelector((state) => state.products?.items) || [];
  const orders = useSelector((state) => state.orders?.orders) || [];
  const users = useSelector(selectUsers) || [];

  const [dismissedIds, setDismissedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Global Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { products: [], orders: [], users: [] };
    const q = searchQuery.toLowerCase();
    return {
      products: products
        .filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p._id?.toLowerCase().includes(q)
        )
        .slice(0, 3),
      orders: orders
        .filter(
          (o) =>
            o._id?.toLowerCase().includes(q) ||
            o.user?.name?.toLowerCase().includes(q)
        )
        .slice(0, 3),
      users: users
        .filter(
          (u) =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.role?.toLowerCase().includes(q)
        )
        .slice(0, 3),
    };
  }, [searchQuery, products, orders, users]);

  // Compute live notifications dynamically
  const notifications = [
    // Top 3 Recent Orders
    ...orders.slice(0, 3).map((order) => ({
      id: `order-${order._id}`,
      title: "New order received",
      description: `Order #${order._id.substring(0, 8)} for $${(order.totalAmount || order.totalPrice || 0).toFixed(2)}`,
      time: new Date(order.createdAt).toLocaleDateString(),
      type: "success",
    })),
    // Low Stock Products
    ...products
      .filter((p) => p.stock <= 10)
      .map((p) => ({
        id: `stock-${p._id}`,
        title: p.stock === 0 ? "Out of stock!" : "Low stock warning",
        description: `${p.name} is down to ${p.stock} units`,
        time: "Just now",
        type: p.stock === 0 ? "error" : "warning",
      })),
  ].map((n) => ({
    ...n,
    read: dismissedIds.includes(n.id),
  }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setDismissedIds(notifications.map((n) => n.id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-rose-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85 sm:px-6 transition-colors duration-200">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Dynamic Title */}
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-2xl capitalize">
          {activeTab}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search - Hidden on small mobile */}
        <div className="relative hidden max-w-xs sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search dashboard..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            className="h-9 w-48 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition-all duration-200 focus:w-64 focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-205 dark:focus:bg-slate-900 dark:focus:border-purple-400"
          />

          {/* Global Search Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg ring-1 ring-black/5 p-2 max-h-[70vh] overflow-y-auto animate-fadeIn">
              
              {/* Products */}
              {searchResults.products.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Products</h3>
                  {searchResults.products.map(p => (
                    <div 
                      key={p._id} 
                      onClick={() => {
                        dispatch(setActiveTab("products"));
                        dispatch(setProductSearch(p.name));
                        setShowSearchDropdown(false);
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="h-8 w-8 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                        <p className="text-xs text-slate-500 truncate">${(p.price || 0).toFixed(2)} • {p.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Orders */}
              {searchResults.orders.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Orders</h3>
                  {searchResults.orders.map(o => (
                    <div 
                      key={o._id} 
                      onClick={() => {
                        dispatch(setActiveTab("orders"));
                        dispatch(setSelectedOrder(o));
                        setShowSearchDropdown(false);
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="h-8 w-8 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">#{o._id.substring(0,8)}</p>
                        <p className="text-xs text-slate-500 truncate">{o.user?.name || "Guest"} • ${(o.totalAmount || o.totalPrice || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Users */}
              {searchResults.users.length > 0 && (
                <div className="mb-1">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Users</h3>
                  {searchResults.users.map(u => (
                    <div 
                      key={u._id} 
                      onClick={() => {
                        dispatch(setActiveTab("customers"));
                        setShowSearchDropdown(false);
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{u.name}</p>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {searchResults.products.length === 0 && searchResults.orders.length === 0 && searchResults.users.length === 0 && (
                <div className="py-6 text-center">
                  <Search className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-500" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-semibold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/50">
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 dark:border-slate-850">
                <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-purple-600 hover:underline dark:text-purple-400 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="mt-1 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-xs text-slate-400">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex gap-3 rounded-lg p-3 transition-colors duration-150 hover:bg-slate-55 dark:hover:bg-slate-900 ${
                        !notif.read
                          ? "bg-purple-50/30 dark:bg-purple-950/10"
                          : ""
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-755 dark:text-slate-200">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-450">
                          {notif.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-full p-0.5 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/80 transition-colors"
          >
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`
              }
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover"
            />

            <span className="hidden pr-2 text-xs font-medium text-slate-750 dark:text-slate-300 md:block">
              {user?.name || "User"}
            </span>
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-850">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {user?.email || "No email"}
                </p>
              </div>
              <div className="mt-1.5 space-y-0.5">
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User className="h-3.5 w-3.5" />
                  My Profile
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings className="h-3.5 w-3.5" />
                  Account Settings
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-850 my-1"></div>
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs text-rose-600"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("adminUser");

                    window.location.reload();
                  }}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
