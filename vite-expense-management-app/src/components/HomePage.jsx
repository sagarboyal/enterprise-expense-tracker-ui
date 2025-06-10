const HomePage = () => {
  return (
    <div className='h-screen w-screen bg-white p-6 rounded shadow-md'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-4 items-center'>
        Welcome to Trex Dashboard
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        <div className='p-4 bg-blue-50 border-l-4 border-blue-500 rounded shadow'>
          <h3 className='text-lg font-semibold text-blue-700'>
            Expense Management
          </h3>
          <p className='text-sm text-blue-600'>
            Track and manage all your expenses in one place.
          </p>
        </div>

        <div className='p-4 bg-green-50 border-l-4 border-green-500 rounded shadow'>
          <h3 className='text-lg font-semibold text-green-700'>Analytics</h3>
          <p className='text-sm text-green-600'>
            Get insights and trends from your financial data.
          </p>
        </div>

        <div className='p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded shadow'>
          <h3 className='text-lg font-semibold text-yellow-700'>
            Notifications
          </h3>
          <p className='text-sm text-yellow-600'>
            Stay updated with alerts and messages.
          </p>
        </div>

        <div className='p-4 bg-red-50 border-l-4 border-red-500 rounded shadow'>
          <h3 className='text-lg font-semibold text-red-700'>Audit Logs</h3>
          <p className='text-sm text-red-600'>
            Admin access to track activity and system logs.
          </p>
        </div>
      </div>

      <div className='mt-8'>
        <p className='text-gray-600 text-sm'>
          Tip: Use the sidebar to explore different sections of the dashboard.
          Your role determines which features you can access.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
