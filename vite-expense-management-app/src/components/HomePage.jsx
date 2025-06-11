import { Outlet } from "react-router-dom";
import SidePanel from "./SidePanel";

const HomePage = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 h-screen bg-gray-50'>
      {/* 📂 Sidebar Navigation */}
      <SidePanel />

      {/* 📊 Main Dynamic Content */}
      <main className='col-span-3 bg-white rounded-xl p-6 shadow-md overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  );
};

export default HomePage;
