import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  PresentationChartLineIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Expense Management",
    text: "Track and manage all your expenses in one place with ease.",
    icon: BanknotesIcon,
  },
  {
    title: "Data Analytics",
    text: "Get powerful insights and identify trends from your financial data.",
    icon: ChartBarIcon,
  },
  {
    title: "Smart Notifications",
    text: "Stay updated with intelligent alerts and important messages.",
    icon: BellAlertIcon,
  },
  {
    title: "Audit Logs",
    text: "Admin access to securely track all activity and system logs.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Export Expenses",
    text: "Easily download your complete expense records as a PDF.",
    icon: DocumentArrowDownIcon,
  },
  {
    title: "Visual Insights",
    text: "Visualize your spending habits with intuitive charts and graphs.",
    icon: PresentationChartLineIcon,
  },
];

const Introduction = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8'>
      <div className='text-center'>
        <h1 className='text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight'>
          Welcome to{" "}
          <span className='bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text'>
            TREX
          </span>{" "}
          Your New Expense Hub
        </h1>
        <p className='mt-4 max-w-3xl mx-auto text-lg md:text-xl text-slate-600'>
          Effortlessly manage your expenses, gain valuable insights, and take
          full control of your financial workflow with our intuitive platform.
        </p>
      </div>

      {/* This custom CSS is needed to create the staggered animation effect */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
            opacity: 0;
          }
        `}
      </style>

      <div className='mt-16 w-full max-w-6xl grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className='animate-fade-in-up rounded-xl bg-white p-8 shadow-lg border border-slate-200/80 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl'
              style={{ animationDelay: `${index * 100}ms` }} // Staggered animation delay
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500 text-white'>
                <Icon className='h-6 w-6' aria-hidden='true' />
              </div>
              <h3 className='mt-6 text-xl font-bold text-slate-800'>
                {feature.title}
              </h3>
              <p className='mt-2 text-base text-slate-600'>{feature.text}</p>
            </div>
          );
        })}
      </div>

      <Link
        to='/homepage'
        className='mt-16 inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white text-base font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105'
      >
        Get Started
      </Link>
    </div>
  );
};

export default Introduction;
