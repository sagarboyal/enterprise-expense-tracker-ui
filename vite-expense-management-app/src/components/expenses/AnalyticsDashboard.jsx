import { Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import api from "../../services/api";

const MONTH_COLORS = [
  "#6366F1",
  "#F97316",
  "#10B981",
  "#F43F5E",
  "#3B82F6",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
  "#EAB308",
  "#DB2777",
  "#6B7280",
  "#22C55E",
];

const STATUS_COLORS = {
  pending: "#8B5CF6",
  approved: "#4ADE80",
  rejected: "#EF4444",
};

export default function AnalyticsDashboard({ refreshKey }) {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [summary, setSummary] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const { data: categoryRes } = await api.get("/api/analytics/category");
      const { data: monthRes } = await api.get("/api/analytics/monthly");
      const { data: statusRes } = await api.get("/api/analytics/status");
      const { data: weeklyRes } = await api.get("/api/analytics/weekly");
      const { data: summaryRes } = await api.get("/api/analytics/summary");

      setSummary(summaryRes);
      setCategoryData(categoryRes);
      setMonthlyData(monthRes);
      setStatusData(statusRes);
      setWeeklyData(weeklyRes);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [refreshKey]);

  return (
    <div className='w-full max-w-7xl mx-auto mb-10 space-y-10'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {summary && (
          <>
            <SummaryCard
              title='Total Expenses'
              value={`₹${summary.totalExpenses?.toLocaleString() ?? "0"}`}
              color='text-indigo-600'
            />
            <SummaryCard
              title='Approvals This Month'
              value={summary.approvedCountThisMonth ?? 0}
              color='text-green-600'
            />
            <SummaryCard
              title='Pending Approvals'
              value={summary.pendingApprovals ?? 0}
              color='text-purple-600'
            />
            <SummaryCard
              title='Rejections This Month'
              value={summary.rejectedExpenses ?? 0}
              color='text-red-500'
            />
          </>
        )}
      </div>

      {/* Monthly and Weekly Charts Side by Side */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Monthly Chart */}
        <Card className='shadow-lg rounded-2xl border border-slate-100'>
          <CardContent>
            <h2 className='text-xl font-semibold text-slate-800 mb-4'>
              📊 Monthly Expenses Trend
            </h2>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey='month' tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey='total' radius={[8, 8, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell
                      key={`mon-${index}`}
                      fill={MONTH_COLORS[index % MONTH_COLORS.length]}
                    />
                  ))}
                  <LabelList
                    dataKey='total'
                    position='top'
                    formatter={(value) => `₹${value}`}
                    style={{ fontSize: 10 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Chart */}
        <Card className='shadow-lg rounded-2xl border border-slate-100'>
          <CardContent>
            <h2 className='text-xl font-semibold text-slate-800 mb-4'>
              📅 This Week's Spending
            </h2>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={weeklyData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey='day' tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey='total' radius={[6, 6, 0, 0]} fill='#3B82F6'>
                  <LabelList
                    dataKey='total'
                    position='top'
                    formatter={(value) => `₹${value}`}
                    style={{ fontSize: 10 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Approval Status Pie Chart */}
      <Card className='shadow-lg rounded-2xl border border-slate-100'>
        <CardContent>
          <h2 className='text-xl font-semibold text-slate-800 mb-4'>
            🚦 Expenses by Approval Status
          </h2>
          <ResponsiveContainer width='100%' height={350}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey='total'
                nameKey='status'
                cx='50%'
                cy='50%'
                outerRadius={120}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      STATUS_COLORS[entry.status.toLowerCase()] || "#A78BFA"
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Bar Chart */}
      <Card className='shadow-lg rounded-2xl border border-slate-100'>
        <CardContent>
          <h2 className='text-xl font-semibold text-slate-800 mb-4'>
            🧾 Expenses by Category
          </h2>
          <ResponsiveContainer width='100%' height={350}>
            <BarChart
              data={categoryData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey='category' tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey='total' radius={[8, 8, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cat-${index}`}
                    fill={MONTH_COLORS[index % MONTH_COLORS.length]}
                  />
                ))}
                <LabelList
                  dataKey='total'
                  position='top'
                  style={{ fontSize: 10 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <Card className='shadow-lg rounded-xl border border-slate-100 p-4 text-center'>
      <h3 className='text-md font-medium text-gray-700 mb-1'>{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </Card>
  );
}
