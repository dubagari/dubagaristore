
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ data = [] }) {
  const hasRealData = data.some(
    (d) => Number(d.revenue) > 0 || Number(d.expenses) > 0
  );

  const formatCurrency = (tickItem) => {
    if (tickItem >= 1000) return `$${(tickItem / 1000).toFixed(0)}k`;
    return `$${tickItem}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
          <p className="mb-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            {label}
          </p>

          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs font-semibold"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />

              <span className="capitalize text-slate-500 dark:text-slate-400">
                {entry.name}:
              </span>

              <span className="text-slate-800 dark:text-slate-100">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Revenue Performance
          </h3>

          <p className="text-xs text-slate-450">
            Track monthly earnings compared against operations costs
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            hasRealData
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              hasRealData ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />

          {hasRealData ? "Live Data" : "No Data"}
        </span>
      </div>

      {!hasRealData ? (
        <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No revenue data available yet.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
                className="dark:stroke-slate-800/50"
              />

              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />

              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
                dx={-5}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                name="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />

              <Area
                name="expenses"
                type="monotone"
                dataKey="expenses"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}