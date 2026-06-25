import React from "react";
import { Link } from "react-router-dom";
import Shopcommon from "../UI/Shopcommon";

const Success = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen pb-20 transition-colors duration-200">
      <Shopcommon title="Payment Successful" />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-4xl font-bold"></i>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            Thank you for your purchase!
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Your payment has been successfully processed and your order is confirmed. 
            We will send you a confirmation email with your order details shortly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link to="/orders" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all">
                View My Orders
              </button>
            </Link>
            <Link to="/shop" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Success;
