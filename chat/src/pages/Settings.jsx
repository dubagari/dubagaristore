import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Key,
  Database,
  Mail,
  Globe,
  Save,
  Trash2,
  Plus,
  CheckCircle,
  RefreshCcw,
} from "lucide-react";

import { useRef } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Form states

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file || !user?._id) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/upload-avatar/${user._id}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // Update React state
      setUser(data.user);

      // Persist after refresh
      localStorage.setItem("adminUser", JSON.stringify(data.user));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  };

  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@company.com",
    role: "Administrator",
    phone: "+1 (555) 234-5678",
  });

  const storedUser = localStorage.getItem("adminUser");

  const adminUser =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState(adminUser);

  const name = user?.name;
  const email = user?.email;

  const [notificationSettings, setNotificationSettings] = useState({
    orderEmail: true,
    stockWarning: true,
    stockThreshold: 10,
    securityAlerts: true,
  });

  const [apiKeys, setApiKeys] = useState([
    {
      name: "Production Checkout API",
      key: "pk_live_8x29...912a",
      created: "Jan 10, 2026",
    },
    {
      name: "Testing Sandbox Key",
      key: "pk_test_3a51...583b",
      created: "May 24, 2026",
    },
  ]);

  const [newKeyName, setNewKeyName] = useState("");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateApiKey = (e) => {
    e.preventDefault();
    if (!newKeyName) return;

    const randomHex =
      Math.random().toString(16).substring(2, 6) +
      "..." +
      Math.random().toString(16).substring(2, 6);
    const newKey = {
      name: newKeyName,
      key: `pk_live_${randomHex}`,
      created: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
  };

  const handleRevokeKey = (keyString) => {
    setApiKeys(apiKeys.filter((k) => k.key !== keyString));
  };

  const toggleNotificationSetting = (field) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: !notificationSettings[field],
    });
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "notifications", label: "Alerts & Notifications", icon: Bell },
    { id: "security", label: "API & Security", icon: Key },
    { id: "system", label: "Database & System", icon: Database },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
            Control Center Settings
          </h2>
          <p className="text-sm text-slate-450">
            Manage administrative credentials, API integrations, and
            notification configs
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Side: Navigation Tabs List */}
        <div className="w-full shrink-0 lg:w-64">
          <div className="flex flex-row overflow-x-auto gap-1 border-b border-slate-200 lg:flex-col lg:border-b-0 lg:border-r lg:border-slate-200 dark:border-slate-800 lg:pr-4 pb-3 lg:pb-0 text-xs font-semibold">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-left transition-all whitespace-nowrap lg:whitespace-normal ${
                    isActive
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 font-bold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-850 dark:text-slate-400 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tab panel contents */}
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm relative overflow-hidden">
          {/* Saved Change Notification  */}
          {savedSuccess && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-450 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs font-bold shadow-md animate-slideDown">
              <CheckCircle className="h-4.5 w-4.5" />
              Settings saved successfully!
            </div>
          )}

          {/* Profile Settings Section */}
          {activeTab === "profile" && (
            <form
              onSubmit={handleSaveProfile}
              className="space-y-6 text-xs font-semibold"
            >
              <div className=" flext justify-between border-b border-slate-100 pb-4 px-5 dark:border-slate-800 flex items-center gap-4">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User",
                    )}`
                  }
                  alt="Avatar"
                  onClick={() => !loading && fileInputRef.current?.click()}
                  className={`h-16 w-16 rounded-full object-cover ring-2 ring-purple-500/20 transition ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:opacity-80"
                  }`}
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div>
                  <h4 className="text-sm font-bold text-slate-855 dark:text-slate-100">
                    {user?.role}
                  </h4>
                  <p className="text-slate-450 text-[15px]">{user.name}</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={user?.name}
                    onChange={(e) =>
                      setProfile({ ...user, name: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={user?.name}
                    onChange={(e) =>
                      setProfile({ ...user, name: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                    Primary Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    onChange={(e) =>
                      setProfile({ ...user, email: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={user?.phone}
                    onChange={(e) =>
                      setProfile({ ...user, phone: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2.5 text-white shadow-md shadow-purple-650/15 hover:bg-purple-700 transition-all font-bold"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Alerts & Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6 text-xs font-semibold">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                  Email Alerts settings
                </h3>
                <p className="text-[10px] text-slate-450">
                  Configure updates and email triggers on activity logs
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <p className="text-slate-700 dark:text-slate-200">
                      New Order Alerts
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Receive transaction receipts on new checkout
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotificationSetting("orderEmail")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      notificationSettings.orderEmail
                        ? "bg-purple-600"
                        : "bg-slate-250 dark:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        notificationSettings.orderEmail
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <p className="text-slate-700 dark:text-slate-200">
                      Low Stock Warnings
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Triggers alert when item drops below threshold (
                      {notificationSettings.stockThreshold})
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotificationSetting("stockWarning")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      notificationSettings.stockWarning
                        ? "bg-purple-600"
                        : "bg-slate-250 dark:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        notificationSettings.stockWarning
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <p className="text-slate-700 dark:text-slate-200">
                      Security Reports
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Get notified of new logins or settings edits
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotificationSetting("securityAlerts")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      notificationSettings.securityAlerts
                        ? "bg-purple-600"
                        : "bg-slate-250 dark:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        notificationSettings.securityAlerts
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API Keys & Security Integration */}
          {activeTab === "security" && (
            <div className="space-y-6 text-xs font-semibold">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                  Developer Credentials
                </h3>
                <p className="text-[10px] text-slate-450">
                  Generate and revoke API credentials to query the backend
                  database
                </p>
              </div>

              {/* Generate Key Form */}
              <form
                onSubmit={handleCreateApiKey}
                className="flex gap-3 items-end max-w-md"
              >
                <div className="flex-1">
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                    Key Nickname
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mobile App integration"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-purple-400"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all font-bold inline-flex items-center gap-1 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Create Key
                </button>
              </form>

              {/* API keys list */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Active Keys
                </h4>
                {apiKeys.length === 0 ? (
                  <p className="text-slate-400 py-4">
                    No credentials created yet.
                  </p>
                ) : (
                  apiKeys.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <div>
                        <p className="text-slate-800 dark:text-slate-200 font-bold">
                          {item.name}
                        </p>
                        <code className="text-[11px] block mt-1 font-mono text-purple-600 dark:text-purple-400 bg-purple-50/30 dark:bg-purple-950/10 px-2 py-0.5 rounded max-w-fit">
                          {item.key}
                        </code>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-slate-450">
                          Issued: {item.created}
                        </span>
                        <button
                          onClick={() => handleRevokeKey(item.key)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:text-rose-405 dark:hover:bg-rose-955/20 transition-all"
                          title="Revoke Key"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* System & Database Diagnostics */}
          {activeTab === "system" && (
            <div className="space-y-6 text-xs font-semibold">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                  System Environment
                </h3>
                <p className="text-[10px] text-slate-450">
                  Review administrative runtime settings and service endpoints
                </p>
              </div>

              {/* Diagnostic data grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800 space-y-1">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                    Database Connection
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    MongoDB Atlas Cluster (Connected)
                  </span>
                </div>

                <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800 space-y-1">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                    Server Latency
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5">
                    <RefreshCcw className="h-3.5 w-3.5 text-indigo-500" />
                    14ms (Optimal)
                  </span>
                </div>

                <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800 space-y-1">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                    Storage Usage
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">
                    1.42 GB / 10.00 GB (14.2%)
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full"
                      style={{ width: "14.2%" }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800 space-y-1">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                    Dashboard version
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">
                    Apex Control v2.4.0 (React 19.2)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
