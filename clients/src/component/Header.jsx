import React, { useRef, useState } from "react";
import { data } from "./Data";
import { Link, useNavigate } from "react-router-dom";
import userIcon from "../assets/images/user-icon.png";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/slice/authSlice";
import { selectWishlistItems } from "../store/slice/wishlistSlice";
import { Heart, ShoppingBag } from "lucide-react";

const Header = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const wishlistItems = useSelector(selectWishlistItems);
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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

          // Update React state and local storage via Redux
          dispatch(authActions.loginSuccess({ user: data.user, token }));
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);

          // Allow selecting the same file again
          e.target.value = "";
        }
      };

  const navigateToCart = () => {
    navigate("/cart");
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-1.5">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white uppercase">
                dubagari
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  store
                </span>
              </h2>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {data.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="text-sm font-semibold text-slate-600 hover:text-purple-600 dark:text-slate-350 dark:hover:text-purple-400 transition-colors duration-200"
              >
                {item.display}
              </Link>
            ))}
          </nav>

          {/* Header Action Icons */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <div 
              onClick={() => navigate("/wishlist")}
              className="relative cursor-pointer text-slate-600 hover:text-purple-600 dark:text-slate-350 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <Heart className="text-2xl"/>
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white animate-pulse">
                {wishlistItems?.length || 0}
              </span>
            </div>

            {/* Shopping Cart */}
            <div
              onClick={navigateToCart}
              className="relative cursor-pointer text-slate-600 hover:text-purple-600 dark:text-slate-350 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <ShoppingBag className="text-2xl"/>
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white animate-bounce">
                {totalQuantity}
              </span>
            </div>

            {/* User Dropdown Profile */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.name || "User",
                        )}`
                      }
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/20 hover:opacity-80 transition-opacity"
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-fadeIn">
                      {/* Avatar Upload inside Dropdown */}
                      <div className="flex flex-col items-center border-b border-slate-100 pb-4 pt-2 px-4 dark:border-slate-800 text-center">
                        <img
                          src={
                            user?.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user?.name || "User",
                            )}`
                          }
                          alt="Avatar"
                          onClick={() => !loading && fileInputRef.current?.click()}
                          title="Click to update avatar"
                          className={`h-16 w-16 rounded-full object-cover ring-2 ring-purple-500/20 mb-3 transition ${
                            loading
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer hover:scale-105 hover:ring-purple-500/50"
                          }`}
                        />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate w-full">
                          {user?.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {user?.role}
                        </p>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left mt-2 block px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 dark:bg-purple-950/40 px-4 py-2 rounded-xl transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl shadow-md shadow-purple-650/10 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
