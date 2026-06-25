import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Shopcommon from "../UI/Shopcommon";
import PaystackCheckout from "../component/PaystackCheckout";

const CkechOut = () => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [postal, setPostal] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("");
  const [orderCreated, setOrderCreated] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!address || !city || !phone || !postal || !state) {
      toast.error("Please fill in all shipping details");
      return;
    }

    if (!token) {
      toast.error("You are not logged in");
      navigate("/login");
      return;
    }

    // ✅ Fix: prevent re-submitting if order already created
    if (orderCreated) return;

    setLoading(true);
    setError(null);

    const orderItems = cartItems.map((item) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: {
            address,
            city,
            state,
            country: "Nigeria",
            postalCode: postal,
          },
          paymentMethod: "Paystack",
        }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Fix #5: backend returns totalPrice (not totalAmount) — map it correctly
        setOrderCreated({
          ...data.data,
          totalAmount: data.data.totalPrice,
        });
        toast.success("Order created! Proceed to payment.");
      } else {
        const msg = data.message || "Order creation failed";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 transition-colors duration-200">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-md text-center space-y-6">
          <div className="text-5xl text-purple-600 dark:text-purple-400">
            <i className="ri-user-unfollow-line"></i>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
              Authentication Required
            </h3>
            <p className="text-sm text-slate-400">
              You must be logged in to complete your checkout process.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/login" className="inline-block w-full">
              <button className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all">
                Login / Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen pb-20 transition-colors duration-200">
      <Shopcommon title="Checkout" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-lg font-bold text-slate-500">
              No items to checkout
            </h3>
            <Link to="/shop">
              <button className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm">
                Shop Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Shipping Form Column */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white pb-3 border-b border-slate-50 dark:border-slate-800">
                Shipping Information
              </h3>

              {/* ✅ Fix #4: removed all duplicate nested div wrappers — clean single structure */}
              <form
                onSubmit={handlePlaceOrder}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-semibold text-xs text-left"
              >
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-slate-400">Recipient Full Name</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +234 803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:bg-white focus:border-purple-500 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-slate-400">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 123 Main Street, Suite 4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:bg-white focus:border-purple-500 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-slate-400">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Bauchi"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:bg-white focus:border-purple-500 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:bg-white focus:border-purple-500 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400">Postal / Zip Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 100001"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:bg-white focus:border-purple-500 dark:text-slate-200"
                  />
                </div>

                {/* Error message */}
                {error && (
                  <div className="sm:col-span-2 text-sm text-rose-500 font-semibold">
                    {error}
                  </div>
                )}

                {/* Action area */}
                <div className="sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {orderCreated ? (
                    <div className="space-y-4">
                      <p className="text-green-600 font-semibold text-sm">
                        ✅ Order created successfully. Proceed to payment.
                      </p>
                      {/* ✅ Fix #5: totalAmount is now correctly set from totalPrice */}
                      <PaystackCheckout order={orderCreated} email={user.email} />
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wider uppercase transition-all"
                    >
                      {loading ? "Processing Order..." : "Place Order"}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Cart Preview Column */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3">
                Your Order
              </h3>

              <div className="space-y-4 max-h-60 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{item.quantity}x</span>
                      <p className="text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                        {item.name}
                      </p>
                    </div>
                    <span className="text-slate-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 font-semibold text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="text-slate-850 dark:text-white">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping:</span>
                  <span className="text-emerald-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between border-t border-slate-50 dark:border-slate-800 pt-3 text-base">
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    Total:
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CkechOut;
