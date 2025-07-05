import { Outlet } from "react-router-dom";
import TopPanel from "./TopPanel";

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div>
        <TopPanel />
      </div>

      <main className='overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  );
};

export default HomePage;
