import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/slice/authSlice";
import { } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await res.json();
      if (json.success) {
        dispatch(
          authActions.loginSuccess({
            token: json.token,
            user: json.user,
          }),
        );
       
        navigate("/login");
      } else {
        toast.error(json.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to the authentication server.");
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
            Sign Up
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Create an account to track orders and access chat support
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSignup}
          className="space-y-4 font-semibold text-xs text-left"
        >
          <div className="space-y-1.5">
            <label className="text-slate-505 dark:text-slate-400">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:bg-white focus:border-purple-500 dark:text-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-505 dark:text-slate-400">
              Email Address
            </label>
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
            <label className="text-slate-505 dark:text-slate-400">
              Password
            </label>
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
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs font-semibold text-slate-400 border-t border-slate-55 dark:border-slate-850 pt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
