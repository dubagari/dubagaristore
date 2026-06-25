// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// export default function OrdersChart({ data }) {
//   const chartData = data || [
//     { name: 'Mon', completed: 45, pending: 15 },
//     { name: 'Tue', completed: 50, pending: 12 },
//     { name: 'Wed', completed: 62, pending: 22 },
//     { name: 'Thu', completed: 48, pending: 10 },
//     { name: 'Fri', completed: 78, pending: 30 },
//     { name: 'Sat', completed: 90, pending: 8 },
//     { name: 'Sun', completed: 55, pending: 14 },
//   ];

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95 text-xs">
//           <p className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">{label}</p>
//           {payload.map((entry, index) => (
//             <div key={index} className="flex items-center gap-2 font-semibold py-0.5">
//               <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
//               <span className="text-slate-500 dark:text-slate-400 capitalize">{entry.name}:</span>
//               <span className="text-slate-800 dark:text-slate-100">{entry.value} orders</span>
//             </div>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//       <div className="mb-6">
//         <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Order Fulfillments</h3>
//         <p className="text-xs text-slate-450">Track completed shipments and pending queues by day</p>
//       </div>

//       <div className="h-72 w-full text-xs">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={chartData}
//             margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/50" />
//             <XAxis
//               dataKey="name"
//               stroke="#94a3b8"
//               fontSize={10}
//               tickLine={false}
//               axisLine={false}
//               dy={10}
//             />
//             <YAxis
//               stroke="#94a3b8"
//               fontSize={10}
//               tickLine={false}
//               axisLine={false}
//               dx={-5}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend
//               layout="horizontal"
//               verticalAlign="top"
//               align="right"
//               iconType="circle"
//               iconSize={8}
//               wrapperStyle={{ top: -15, paddingBottom: '10px' }}
//             />
//             <Bar name="completed" dataKey="completed" fill="#a855f7" radius={[4, 4, 0, 0]} />
//             <Bar name="pending" dataKey="pending" fill="#cbd5e1" radius={[4, 4, 0, 0]} className="dark:fill-slate-700" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }



import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function OrdersChart({ data = [] }) {
  const hasRealData = data.some(
    (d) => Number(d.completed) > 0 || Number(d.pending) > 0
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3 text-xs shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
          <p className="mb-1.5 font-bold text-slate-800 dark:text-slate-200">
            {label}
          </p>

          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center gap-2 py-0.5 font-semibold"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />

              <span className="capitalize text-slate-500 dark:text-slate-400">
                {entry.name}:
              </span>

              <span className="text-slate-800 dark:text-slate-100">
                {entry.value} orders
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
            Order Fulfillments
          </h3>

          <p className="text-xs text-slate-450">
            Track completed shipments and pending queues by day
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
            No order data available yet.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
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
                dx={-5}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                layout="horizontal"
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ top: -15, paddingBottom: "10px" }}
              />

              <Bar
                name="completed"
                dataKey="completed"
                fill="#a855f7"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                name="pending"
                dataKey="pending"
                fill="#cbd5e1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}