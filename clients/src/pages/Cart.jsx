import React, { useEffect } from "react";
import { toast } from "react-toastify"; // ✅ Fix #1: missing toast import
import Shopcommon from "../UI/Shopcommon";
import {Trash2} from "lucide-react"
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  selectCartLoading,
} from "../store/slice/cartSlice";
import { fetchCart, removeFromCart } from "../store/slice/cartThunks";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const loading = useSelector(selectCartLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.token) {
      dispatch(fetchCart());
    }
  }, [dispatch]);

  const handleDeleteItem = (productId) => {
    // ✅ Fix #2: use productId (item.product), not item.id which doesn't exist
    dispatch(removeFromCart(productId));
    toast.error("Item removed from cart");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen pb-20 transition-colors duration-200">
      <Shopcommon title="Shopping Cart" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <div className="text-5xl text-slate-350 dark:text-slate-600">
              <i className="ri-shopping-cart-2-line animate-bounce inline-block"></i>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-700 dark:text-slate-300">
                Your cart is empty
              </h3>
              <p className="text-sm text-slate-400">
                Add products to your cart to start shopping.
              </p>
            </div>
            <Link to="/shop">
              <button className="mt-4 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Table Column */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4 text-center">Qty</th>
                      <th className="py-4 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {cartItems.map((item, index) => (
                      // ✅ Fix #3: key must be inside the JSX expression on the element
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 text-sm font-semibold transition-colors"
                      >
                        <td className="py-5 px-6 flex items-center gap-4 min-w-[250px]">
                          <div className="h-16 w-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <span
                            className="font-bold text-slate-850 dark:text-white truncate max-w-[150px]"
                            title={item.name}
                          >
                            {item.name}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-slate-900 dark:text-white">
                          ${parseFloat(item.price).toFixed(2)}
                        </td>
                        <td className="py-5 px-4 text-center text-slate-600 dark:text-slate-350">
                          {item.quantity}
                        </td>
                        <td className="py-5 px-6 text-center">
                          <button
                            onClick={() => handleDeleteItem(item.product)}
                            className="h-8 w-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:hover:bg-rose-950/30 flex items-center justify-center transition-colors mx-auto"
                            title="Remove Item"
                          >
                           <Trash2/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Billing Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-3 font-semibold text-sm">
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

                <div className="space-y-3 pt-3">
                  <Link to="/checkout" className="block w-full">
                    <button className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all">
                      Proceed to Checkout
                    </button>
                  </Link>
                  <Link to="/shop" className="block w-full text-center">
                    <button className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 font-semibold text-sm transition-all">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Cart;
