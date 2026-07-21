import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Shopcommon from "../UI/Shopcommon";

const Orders = () => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

   const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [isAuthenticated, token, navigate]);

  if (loading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-20 text-center">
        <p className="text-slate-500 font-semibold">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-20 text-center">
        <p className="text-rose-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen pb-20 transition-colors duration-200">
      <Shopcommon title="My Orders" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {orders.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-lg font-bold text-slate-500">
              You haven't placed any orders yet.
            </h3>
            <Link to="/shop">
              <button className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-50 dark:border-slate-800">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Order ID</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {order._id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        order.isPaid
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        order.status === "Delivered"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm font-semibold"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{item.quantity || item.qty}x</span>
                        <p className="text-slate-700 dark:text-slate-200">
                          {item.name}
                        </p>
                      </div>
                      <span className="text-slate-900 dark:text-white">
                        ${(item.price * (item.quantity || item.qty)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                  <span className="text-sm text-slate-500 font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    Total: ${(order.totalPrice ?? order.totalAmount ?? 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;
