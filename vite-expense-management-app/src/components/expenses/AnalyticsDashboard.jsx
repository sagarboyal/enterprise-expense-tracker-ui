import { Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "../../services/api";
const COLORS = ["#6366F1", "#F97316", "#10B981", "#F43F5E", "#3B82F6"];
const MONTH_COLORS = [
  "#6366F1", // Indigo
  "#F97316", // Orange
  "#10B981", // Green
  "#F43F5E", // Red
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EF4444", // Bright Red
  "#14B8A6", // Teal
  "#EAB308", // Yellow
  "#DB2777", // Pink
  "#6B7280", // Gray
  "#22C55E", // Lime
];
const STATUS_COLORS = {
  pending: "#FACC15",
  "manager approve": "#4ADE80",
  "admin approve": "#22C55E",
  "manager reject": "#F87171",
  "admin reject": "#EF4444",
};

export default function AnalyticsDashboard({ refreshKey }) {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [summary, setSummary] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const { data: categoryRes } = await api.get("/api/analytics/category");
      const { data: monthRes } = await api.get("/api/analytics/monthly");
      const { data: statusRes } = await api.get("/api/analytics/status");
      const { data: summaryRes } = await api.get("/api/analytics/summary");

      setSummary(summaryRes);
      setCategoryData(categoryRes);
      setMonthlyData(monthRes);
      setStatusData(statusRes);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [refreshKey]);

  return (
    <div className='w-full max-w-6xl mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
      {/* Summary Cards */}
      {summary && (
        <div className='grid grid-cols-1 md:grid-rows-4 gap-6'>
          <Card className='shadow-lg rounded-xl border border-slate-100 p-1 text-center'>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              Total Expenses
            </h3>
            <p className='text-3xl font-bold text-indigo-600'>
              ${summary.totalExpenses?.toLocaleString() ?? "0"}
            </p>
          </Card>

          <Card className='shadow-lg rounded-xl border border-slate-100 p-1 text-center'>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              Approvals This Month
            </h3>
            <p className='text-3xl font-bold text-green-600'>
              {summary.approvedCountThisMonth ?? 0}
            </p>
          </Card>

          <Card className='shadow-lg rounded-xl border border-slate-100 p-1 text-center'>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              Pending Approvals
            </h3>
            <p className='text-3xl font-bold text-yellow-500'>
              {summary.pendingApprovals ?? 0}
            </p>
          </Card>

          <Card className='shadow-lg rounded-xl border border-slate-100 p-1 text-center'>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              Rejections This Month
            </h3>
            <p className='text-3xl font-bold text-red-600'>
              {
                // Calculate rejection count from statusAnalytics list
                summary.statusAnalytics
                  ? summary.statusAnalytics
                      .filter(
                        (item) =>
                          item.status.toLowerCase().includes("reject") ||
                          item.status.toLowerCase().includes("rejected")
                      )
                      .reduce((acc, item) => acc + item.total, 0)
                  : 0
              }
            </p>
          </Card>
        </div>
      )}

      {/* Category Chart */}
      <Card className='shadow-lg rounded-2xl border border-slate-100'>
        <CardContent>
          <h2 className='text-xl font-semibold text-slate-800 mb-6'>
            🧾 Expenses by Category
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey='total'
                nameKey='category'
                outerRadius={90}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-category-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Chart */}
      <Card className='shadow-lg rounded-2xl border border-slate-100'>
        <CardContent>
          <h2 className='text-xl font-semibold text-slate-800 mb-6'>
            📊 Monthly Expenses Trend
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='total' radius={[6, 6, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell
                    key={`cell-month-${index}`}
                    fill={MONTH_COLORS[index % MONTH_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Chart */}
      <Card className='shadow-lg rounded-xl border border-slate-100'>
        <CardContent>
          <h2 className='text-xl font-semibold text-slate-800 mb-6'>
            🚦 Expenses by Status
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey='total'
                nameKey='status'
                outerRadius={90}
                label={({ status, percent }) =>
                  `${status} ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-status-${index}`}
                    fill={STATUS_COLORS[entry.status] || "#A78BFA"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
