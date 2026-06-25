import React, { useState } from "react";
import { data } from "./Data";
import { Link, useNavigate } from "react-router-dom";
import userIcon from "../assets/images/user-icon.png";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/slice/authSlice";

const Header = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
            <div className="relative cursor-pointer text-slate-600 hover:text-purple-600 dark:text-slate-350 dark:hover:text-purple-400 transition-colors duration-200">
              <i className="ri-shopping-basket-fill text-2xl"></i>
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                0
              </span>
            </div>

            {/* Shopping Cart */}
            <div
              onClick={navigateToCart}
              className="relative cursor-pointer text-slate-600 hover:text-purple-600 dark:text-slate-350 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <i className="ri-shopping-cart-fill text-2xl"></i>
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
                    <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center border border-purple-250 dark:border-purple-800 text-purple-650 dark:text-purple-400 font-bold text-sm">
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-400">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {user?.name}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left mt-1 block px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
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
