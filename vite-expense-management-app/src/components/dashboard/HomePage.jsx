const HomePage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-4xl font-bold mb-4'>
        Welcome to the Expense Management App
      </h1>
      <p className='text-lg text-gray-700 mb-8'>
        Manage your expenses efficiently and effectively.
      </p>
      <button className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300'>
        Get Started
      </button>
    </div>
  );
};
export default HomePage;
