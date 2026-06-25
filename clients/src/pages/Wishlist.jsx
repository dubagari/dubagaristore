import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import Shopcommon from "../UI/Shopcommon";
import { removeFromWishlist } from "../store/slice/wishlistThunks";
import { selectWishlistItems } from "../store/slice/wishlistSlice";
import { addToCart } from "../store/slice/cartThunks";
import { toast } from "react-toastify";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({ id: item.product, ...item }));
    dispatch(removeFromWishlist(item.product)); // Remove from wishlist after adding to cart
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen pb-20 transition-colors duration-200">
      <Shopcommon title="Your Wishlist" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="h-24 w-24 bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Heart className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-sm font-semibold text-slate-400 max-w-md mx-auto mb-8">
              Save your favorite items here so you don't lose track of them.
            </p>
            <Link
              to="/shop"
              className="inline-flex px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-purple-650/30 transition-all"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.product}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <div className="h-48 rounded-2xl overflow-hidden mb-4 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Link
                    to={`/shop/${item.product}`}
                    className="text-lg font-black text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    ${item.price}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-purple-650/20 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" /> Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.product)}
                    className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
