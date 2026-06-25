import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, BarChart3, Package, ShoppingCart, Users, Settings, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { setActiveTab } from '../../redux/slices/navigationSlice';

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, sidebarCollapsed, setSidebarCollapsed }) {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.navigation.activeTab);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-slate-950 text-slate-400 transition-all duration-300 dark:border-slate-900 dark:bg-slate-950 lg:static lg:z-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand / Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-650/40 animate-pulse">
              <Sparkles className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-bold text-white tracking-wide bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
                Apex Dash
              </span>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden h-6 w-6 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white lg:flex"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  dispatch(setActiveTab(item.id));
                  setIsSidebarOpen(false); // Close mobile drawer
                }}
                className={`group flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-650/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'
                }`} />
                {!sidebarCollapsed && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer profile info */}
        {!sidebarCollapsed && (
          <div className="border-t border-slate-900 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-900/60 p-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="Sarah Jenkins Profile"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">Sarah Jenkins</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">Administrator</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
