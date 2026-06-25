import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
} from "lucide-react";
import { toggleDarkMode } from "../../redux/slices/navigationSlice";
import AvatarUpload from "./AvatarUpload";

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.navigation.activeTab);
  const darkMode = useSelector((state) => state.navigation.darkMode);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const storedUser = localStorage.getItem("adminUser");

  const adminUser =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState(adminUser);

  const name = user?.name;
  const email = user?.email;

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New order received",
      description: "Order #3824 from Sarah Jenkins",
      time: "5m ago",
      type: "success",
      read: false,
    },
    {
      id: 2,
      title: "Low stock warning",
      description: "Wireless Headphones is below 10 units",
      time: "1h ago",
      type: "warning",
      read: false,
    },
    {
      id: 3,
      title: "System update completed",
      description: "V2.4.0 dashboard upgrade successful",
      time: "4h ago",
      type: "info",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
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
            className="h-9 w-48 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition-all duration-200 focus:w-64 focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-205 dark:focus:bg-slate-900 dark:focus:border-purple-400"
          />
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
