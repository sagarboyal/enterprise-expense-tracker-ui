const WelcomePage = () => {
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-gray-800'>
        Welcome to the Expense Management App
      </h1>

      <p className='text-gray-600 leading-relaxed'>
        This application helps you manage your expenses efficiently. You can:
      </p>

      <ul className='list-disc list-inside text-gray-700 space-y-1 pl-4'>
        <li>Track your spending over time</li>
        <li>Categorize expenses for better insights</li>
        <li>Generate reports to understand your habits</li>
      </ul>

      <p className='text-gray-600'>
        To get started, head to the <strong>"Expenses"</strong> section from the
        sidebar.
      </p>
    </div>
  );
};

export default WelcomePage;
