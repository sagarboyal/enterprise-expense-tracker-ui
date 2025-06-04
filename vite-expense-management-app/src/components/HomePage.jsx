import Footer from "./Footer";
import NavBar from "./NavBar";

const HomePage = () => {
  return (
    <>
      <NavBar />
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12'>
        <h1 className='text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-6'>
          Welcome to the Expense Management App
        </h1>
        <p className='text-lg sm:text-xl text-gray-600 text-center mb-8'>
          Manage your expenses efficiently and effectively with our easy-to-use
          platform.
        </p>
        <button className='px-8 py-3 bg-black text-white rounded-md shadow-md hover:bg-gray-500 transition duration-300'>
          Get Started
        </button>
      </div>
      <Footer />
    </>
  );
};
export default HomePage;
