import { Link } from "react-router-dom";

const Introduction = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4'>
      <h1 className='text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-6'>
        Welcome to the Expense Management App
      </h1>
      <p className='text-lg sm:text-xl text-gray-600 text-center mb-8 max-w-2xl'>
        Manage your expenses efficiently and effectively with our easy-to-use
        platform.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-6xl'>
        {[
          {
            title: "Expense Management",
            text: "Track and manage all your expenses in one place.",
            color: "blue",
          },
          {
            title: "Analytics",
            text: "Get insights and trends from your financial data.",
            color: "green",
          },
          {
            title: "Notifications",
            text: "Stay updated with alerts and messages.",
            color: "yellow",
          },
          {
            title: "Audit Logs",
            text: "Admin access to track activity and system logs.",
            color: "red",
          },
          {
            title: "Export Expenses",
            text: "Download your expense records as PDF.",
            color: "orange",
          },
          {
            title: "Visual insights",
            text: "Get visual insights into your spending trends.",
            color: "teal",
          },
        ].map(({ title, text, color }) => (
          <div
            key={title}
            className={`p-4 bg-${color}-50 border-l-4 border-${color}-500 rounded shadow`}
          >
            <h3 className={`text-lg font-semibold text-${color}-700`}>
              {title}
            </h3>
            <p className={`text-sm text-${color}-600`}>{text}</p>
          </div>
        ))}
      </div>

      <Link
        to='/homepage'
        className='mt-10 px-8 py-3 bg-black text-white rounded-md shadow-md hover:bg-gray-700 transition duration-300'
      >
        Get Started
      </Link>
    </div>
  );
};

export default Introduction;
