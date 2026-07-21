
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#a855f7",
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#06b6d4",
];

export default function SalesChart({ data = [] }) {
  const hasRealData = data.some((d) => Number(d.value) > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;

      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3 text-xs font-semibold shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
          <p className="mb-1 font-bold text-slate-800 dark:text-slate-200">
            {item.name}
          </p>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span>Value:</span>

            <span className="text-slate-800 dark:text-slate-100">
              ${Number(item.value).toLocaleString()}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Category Breakdown
          </h3>

          <p className="text-xs text-slate-450">
            Inventory value by product category
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
            No category data available yet.
          </p>
        </div>
      ) : (
        <div className="relative h-72 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />

              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}