import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ title, value, change, changeText, trend, icon: Icon }) => {
  const isPositive = trend === "up";

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 
    shadow-sm hover:shadow-md transition-all duration-200 dark:border-slate-800
    dark:bg-slate-900 group hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </span>
        )}
      </div>

      {changeText && (
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
          {changeText}
        </p>
      )}

      {/* Decorative gradient strip at top of card */}
      {/* <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" /> */}
    </div>
  );
};

export default StatCard;
