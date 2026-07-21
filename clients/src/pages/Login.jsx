import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/slice/authSlice";
import { fetchCart } from "../store/slice/cartThunks";
import { fetchWishlist } from "../store/slice/wishlistThunks";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
   const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

     console.log("Login button clicked");
    if (!email || !password) return;



    setLoading(true);
    console.log("Sending login request...");
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);
if (data.success) {
  localStorage.setItem("userInfo", JSON.stringify(data));
  
  dispatch(
    authActions.loginSuccess({
      token: data.token,
      user: data.user,
    })
  );

  
  console.log("Stored user:", localStorage.getItem("user"));
  
  dispatch(fetchCart());
  dispatch(fetchWishlist());
      
  navigate("/");
} else {
  console.error(data.message);
}
    } catch (error) {
      console.error(error);
      data.message;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Login
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 font-semibold text-xs text-left">
          <div className="space-y-1.5">
            <label className="text-slate-500 dark:text-slate-400">Email Address</label>
            <input
              type="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:bg-white focus:border-purple-500 dark:text-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-500 dark:text-slate-400">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:bg-white focus:border-purple-500 dark:text-slate-200"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm tracking-wider uppercase shadow-md shadow-purple-650/10 transition-all flex items-center justify-center"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs font-semibold text-slate-400 border-t border-slate-50 dark:border-slate-850 pt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
