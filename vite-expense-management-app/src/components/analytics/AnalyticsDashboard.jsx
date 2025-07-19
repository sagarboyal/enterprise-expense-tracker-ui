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
} from "recharts";
import api from "../../services/api";
import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// --- Color Palettes ---
const MONTH_COLORS = [
  "#4f46e5",
  "#f97316",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#d946ef",
  "#06b6d4",
  "#f59e0b",
  "#6366f1",
  "#ec4899",
  "#14b8a6",
];

const STATUS_COLORS = {
  APPROVED: "#22c55e",
  PENDING: "#f59e0b",
  REJECTED: "#ef4444",
};

// --- Helper & UI Components ---

const SummaryCard = ({ title, value, icon, iconBgColor }) => (
  <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 flex items-start justify-between transition-all hover:shadow-xl hover:-translate-y-1'>
    <div>
      <p className='text-sm font-medium text-gray-500'>{title}</p>
      <p className='text-3xl font-bold text-gray-900 mt-1'>{value}</p>
    </div>
    <div className={`p-3 rounded-full ${iconBgColor}`}>{icon}</div>
  </div>
);

const ChartCard = ({ title, description, children }) => (
  <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80'>
    <h3 className='text-lg font-bold text-gray-900'>{title}</h3>
    <p className='text-sm text-gray-500 mt-1'>{description}</p>
    <div className='mt-6'>{children}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white/80 backdrop-blur-sm p-3 shadow-lg rounded-lg border border-gray-200'>
        <p className='label text-sm font-bold text-gray-800'>{label}</p>
        <p
          className='intro text-sm font-medium'
          style={{ color: payload[0].fill }}
        >
          {`${payload[0].name}: ${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

// --- Skeleton Loading Components ---

const SkeletonCard = () => (
  <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 animate-pulse'>
    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
    <div className='h-8 bg-gray-300 rounded w-1/2'></div>
  </div>
);

const SkeletonChart = () => (
  <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 animate-pulse'>
    <div className='h-5 bg-gray-200 rounded w-1/3 mb-2'></div>
    <div className='h-4 bg-gray-200 rounded w-2/3 mb-6'></div>
    <div className='h-64 bg-gray-200 rounded-md'></div>
  </div>
);

// --- Main Dashboard Component ---

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [categoryRes, monthRes, statusRes, weeklyRes, summaryRes] =
          await Promise.all([
            api.get("/api/analytics/category"),
            api.get("/api/analytics/monthly"),
            api.get("/api/analytics/status"),
            api.get("/api/analytics/weekly"),
            api.get("/api/analytics/summary"),
          ]);

        setAnalyticsData({
          categoryData: categoryRes.data,
          monthlyData: monthRes.data,
          statusData: statusRes.data,
          weeklyData: weeklyRes.data,
          summary: summaryRes.data,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [refreshTrigger]);

  if (loading || !analyticsData) {
    return (
      <div className='bg-gray-50/50 p-4 sm:p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto space-y-8'>
          <header className='flex justify-between items-center'>
            <div>
              <div className='h-8 bg-gray-300 rounded w-64 mb-2'></div>
              <div className='h-4 bg-gray-200 rounded w-96'></div>
            </div>
          </header>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
            <div className='lg:col-span-3'>
              <SkeletonChart />
            </div>
            <div className='lg:col-span-2'>
              <SkeletonChart />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { categoryData, monthlyData, statusData, weeklyData, summary } =
    analyticsData;
  const totalStatusCount = statusData.reduce(
    (acc, curr) => acc + curr.total,
    0
  );

  const summaryCards = [
    {
      title: "Total Expenses",
      value: `₹${summary.totalExpenses?.toLocaleString() ?? "0"}`,
      icon: <BanknotesIcon className='h-6 w-6 text-indigo-600' />,
      iconBg: "bg-indigo-100",
    },
    {
      title: "Approved This Month",
      value: summary.approvedCountThisMonth ?? 0,
      icon: <CheckBadgeIcon className='h-6 w-6 text-green-600' />,
      iconBg: "bg-green-100",
    },
    {
      title: "Pending Approvals",
      value: summary.pendingApprovals ?? 0,
      icon: <ClockIcon className='h-6 w-6 text-amber-600' />,
      iconBg: "bg-amber-100",
    },
    {
      title: "Rejected Expenses",
      value: summary.rejectedExpenses ?? 0,
      icon: <ExclamationTriangleIcon className='h-6 w-6 text-red-600' />,
      iconBg: "bg-red-100",
    },
  ];

  return (
    <div className='bg-gray-50/50 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <header className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Analytics Dashboard
            </h1>
            <p className='mt-1 text-sm text-gray-600'>
              An overview of your team's expense trends and approval statuses.
            </p>
          </div>
          <button
            onClick={() => setRefreshTrigger((c) => c + 1)}
            className='mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          >
            <ArrowPathIcon className='h-5 w-5' />
            Refresh
          </button>
        </header>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {summaryCards.map((card) => (
            <SummaryCard key={card.title} {...card} />
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
          {/* Monthly Expenses */}
          <div className='lg:col-span-3'>
            <ChartCard
              title='Monthly Expense Trend'
              description='Visualize the total expenses submitted each month over the past year.'
            >
              <ResponsiveContainer width='100%' height={350}>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                >
                  <XAxis
                    dataKey='month'
                    tick={{ fontSize: 12 }}
                    stroke='#6b7280'
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke='#6b7280' />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(79, 70, 229, 0.05)" }}
                  />
                  <Bar
                    dataKey='total'
                    name='Total Expenses'
                    radius={[8, 8, 0, 0]}
                  >
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={MONTH_COLORS[index % MONTH_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Status Breakdown */}
          <div className='lg:col-span-2'>
            <ChartCard
              title='Status Breakdown'
              description='A look at the current approval status of all expenses.'
            >
              <ResponsiveContainer width='100%' height={350}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey='total'
                    nameKey='status'
                    cx='50%'
                    cy='50%'
                    outerRadius={120}
                    innerRadius={80}
                    paddingAngle={3}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType='circle' />
                  <text
                    x='50%'
                    y='45%'
                    textAnchor='middle'
                    dominantBaseline='middle'
                    className='text-3xl font-bold fill-gray-800'
                  >
                    {totalStatusCount}
                  </text>
                  <text
                    x='50%'
                    y='55%'
                    textAnchor='middle'
                    dominantBaseline='middle'
                    className='text-sm fill-gray-500'
                  >
                    Total Expenses
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Category & Weekly Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
          {/* Category Breakdown */}
          <div className='lg:col-span-3'>
            <ChartCard
              title='Top Spending Categories'
              description='Identify which categories account for the most spending across all expenses.'
            >
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={categoryData}
                  layout='vertical'
                  margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
                >
                  <XAxis type='number' hide />
                  <YAxis
                    type='category'
                    dataKey='category'
                    tick={{ fontSize: 12 }}
                    stroke='#6b7280'
                    width={100}
                    interval={0}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(79, 70, 229, 0.05)" }}
                  />
                  <Bar
                    dataKey='total'
                    name='Total Spent'
                    barSize={20}
                    radius={[0, 8, 8, 0]}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={MONTH_COLORS[index % MONTH_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Weekly Spending */}
          <div className='lg:col-span-2'>
            <ChartCard
              title="This Week's Spending"
              description='A day-by-day breakdown of expenses submitted this week.'
            >
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={weeklyData}
                  margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                >
                  <XAxis
                    dataKey='day'
                    tick={{ fontSize: 12 }}
                    stroke='#6b7280'
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke='#6b7280' />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(79, 70, 229, 0.05)" }}
                  />
                  <Bar
                    dataKey='total'
                    name='Amount'
                    fill='#3b82f6'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
