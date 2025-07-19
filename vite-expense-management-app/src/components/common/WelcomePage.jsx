import {
  ChartPieIcon,
  DocumentTextIcon,
  ScaleIcon,
  ArrowRightIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom"; // Assuming you use react-router-dom

const features = [
  {
    name: "Track Your Spending",
    description:
      "Keep a detailed record of your expenses to see where your money goes over time.",
    icon: ScaleIcon,
  },
  {
    name: "Categorize Expenses",
    description:
      "Group your expenses into categories for deeper insights and better financial clarity.",
    icon: ChartPieIcon,
  },
  {
    name: "Generate Reports",
    description:
      "Create and export detailed reports to understand your financial habits and trends.",
    icon: DocumentTextIcon,
  },
];

const WelcomePage = () => {
  return (
    <div className='bg-slate-50 p-6 sm:p-8 rounded-xl shadow-sm min-h-full'>
      <div className='max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight'>
            Welcome to the
            <span className='bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text'>
              {" "}
              Expense Manager
            </span>
          </h1>
          <p className='mt-4 text-lg text-slate-600 leading-relaxed'>
            Your all-in-one solution to take control of your finances
            efficiently and effectively.
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          {features.map((feature) => (
            <div
              key={feature.name}
              className='bg-white p-6 rounded-lg border border-slate-200 shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg'
            >
              <div className='flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600'>
                <feature.icon className='h-6 w-6' aria-hidden='true' />
              </div>
              <h3 className='mt-5 text-lg font-semibold text-slate-800'>
                {feature.name}
              </h3>
              <p className='mt-2 text-sm text-slate-600'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* OPTIMIZED Call to Action Section */}
        <div className='text-center bg-white p-8 rounded-lg shadow-lg border border-slate-200'>
          <h2 className='text-2xl font-bold text-slate-800'>
            Ready to Get Started?
          </h2>
          <p className='mt-2 text-slate-600 max-w-2xl mx-auto'>
            Begin your journey towards financial clarity by adding an expense or
            viewing your analytics.
          </p>
          <div className='mt-8 flex flex-col sm:flex-row justify-center items-center gap-4'>
            {/* Primary Action Button */}
            <Link
              to='/homepage/expenses'
              className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 group'
            >
              Go to Expenses
              <ArrowRightIcon className='h-5 w-5 transition-transform group-hover:translate-x-1' />
            </Link>
            {/* Secondary Action Button */}
            <Link
              to='/homepage/analytics'
              className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-md shadow-sm ring-1 ring-inset ring-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 group'
            >
              View Analytics
              <PresentationChartLineIcon className='h-5 w-5' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
