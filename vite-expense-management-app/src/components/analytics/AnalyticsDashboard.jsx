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
  RadialBarChart,
  RadialBar,
} from "recharts";
import api from "../../services/api";
import {
  TbCalendarMonth,
  TbCalendarWeek,
  TbCategory,
  TbDeviceAnalytics,
} from "react-icons/tb";

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
    <div className='w-full max-w-7xl mx-auto mb-10 space-y-10 font-[Poppins]'>
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
              title='Total Approvals'
              value={summary.approvedCountThisMonth ?? 0}
              color='text-green-600'
            />
            <SummaryCard
              title='Pending Approvals'
              value={summary.pendingApprovals ?? 0}
              color='text-purple-600'
            />
            <SummaryCard
              title='Rejected Approvals'
              value={summary.rejectedExpenses ?? 0}
              color='text-red-500'
            />
          </>
        )}
      </div>

      {/* Monthly and Weekly Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <PremiumCard
          title={
            <div className='flex items-center gap-2'>
              <TbCalendarMonth className='text-indigo-500 text-2xl' />
              <span>Monthly Expenses Trend</span>
            </div>
          }
        >
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
        </PremiumCard>

        <PremiumCard
          title={
            <div className='flex items-center gap-2'>
              <TbCalendarWeek className='text-blue-500 text-2xl' />
              <span>This Week's Spending</span>
            </div>
          }
        >
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
        </PremiumCard>
      </div>

      {/* Category-wise Chart */}
      <PremiumCard
        title={
          <div className='flex items-center gap-2'>
            <TbCategory className='text-blue-500 text-2xl' />
            <span>Category Breakdown</span>
          </div>
        }
      >
        <ResponsiveContainer width='100%' height={400}>
          <BarChart
            data={categoryData}
            layout='vertical'
            margin={{ top: 20, right: 40, left: 60, bottom: 20 }}
          >
            <XAxis type='number' tick={{ fontSize: 12 }} />
            <YAxis
              type='category'
              dataKey='category'
              tick={{ fontSize: 12 }}
              width={120}
            />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey='total' barSize={20} radius={[0, 10, 10, 0]}>
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cat-${index}`}
                  fill={MONTH_COLORS[index % MONTH_COLORS.length]}
                />
              ))}
              <LabelList
                dataKey='total'
                position='right'
                formatter={(value) => `₹${value}`}
                style={{ fontSize: 10 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>

      {/* Approval + Summary Combined Section */}
      {summary && (
        <PremiumCard
          title={
            <div className='flex items-center gap-2'>
              <TbDeviceAnalytics className='text-red-500 text-2xl' />
              <span>Approval & Summary Overview</span>
            </div>
          }
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            {/* Left Section: Donut + Legend */}
            <div className='flex flex-col items-center gap-6'>
              {/* Donut Chart */}
              <PieChart width={300} height={300}>
                <Pie
                  data={statusData}
                  dataKey='total'
                  nameKey='status'
                  cx='50%'
                  cy='50%'
                  outerRadius={100}
                  innerRadius={50}
                  label={({ name, percent, x, y }) => (
                    <text
                      x={x}
                      y={y}
                      fill='#333'
                      textAnchor='middle'
                      dominantBaseline='central'
                      style={{ fontSize: 10 }}
                    >
                      {`${name} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  )}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`status-${index}`}
                      fill={
                        STATUS_COLORS[entry.status.toLowerCase()] || "#A78BFA"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>

              {/* Custom Legend */}
              <div className='w-full max-w-xs space-y-2'>
                {statusData.map((entry, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm'
                  >
                    <div className='flex items-center gap-2'>
                      <span
                        className='w-3 h-3 rounded-full'
                        style={{
                          backgroundColor:
                            STATUS_COLORS[entry.status.toLowerCase()] ||
                            "#A78BFA",
                        }}
                      />
                      <span className='capitalize text-gray-700 text-sm font-medium'>
                        {entry.status}
                      </span>
                    </div>
                    <span className='font-semibold text-sm text-gray-900'>
                      ₹{entry.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section: Radial Bar Summary Chart */}
            <div className='flex justify-center'>
              <RadialBarChart
                width={400}
                height={300}
                innerRadius='20%'
                outerRadius='90%'
                data={[
                  {
                    name: "Total Expenses",
                    value: summary.totalExpenses,
                    fill: "#6366F1",
                  },
                  {
                    name: "Approved",
                    value: summary.approvedCountThisMonth,
                    fill: "#22C55E",
                  },
                  {
                    name: "Pending",
                    value: summary.pendingApprovals,
                    fill: "#8B5CF6",
                  },
                  {
                    name: "Rejected",
                    value: summary.rejectedExpenses,
                    fill: "#EF4444",
                  },
                ]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  minAngle={15}
                  label={{
                    position: "insideStart",
                    fill: "#fff",
                    fontSize: 12,
                  }}
                  background
                  clockWise
                  dataKey='value'
                />
                <Legend
                  iconSize={10}
                  layout='vertical'
                  verticalAlign='middle'
                  align='right'
                  formatter={(value) => (
                    <span className='text-sm'>{value}</span>
                  )}
                />
                <Tooltip />
              </RadialBarChart>
            </div>
          </div>
        </PremiumCard>
      )}
    </div>
  );
}

function PremiumCard({ title, children }) {
  return (
    <Card className='shadow-xl border border-slate-100 rounded-2xl hover:shadow-2xl transition-shadow duration-300'>
      <CardContent>
        <h2 className='text-lg font-semibold text-slate-700 mb-4'>{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <Card className='rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition duration-300'>
      <CardContent className='text-center space-y-2'>
        <h3 className='text-sm font-medium text-gray-500'>{title}</h3>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
