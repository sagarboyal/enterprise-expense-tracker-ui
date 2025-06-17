import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useMyContext } from "../store/ContextApi";
import LogoutDialog from "./utils/LogoutDialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";

const SidePanel = () => {
  const {
    token,
    setToken,
    loggedInUser,
    setloggedInUser,
    isAdmin,
    setIsAdmin,
    isManager,
    setIsManager,
  } = useMyContext();

  const fullName = loggedInUser?.fullName || "User Name";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("USER");
    localStorage.removeItem("CSRF_TOKEN");
    localStorage.removeItem("IS_ADMIN");
    localStorage.removeItem("IS_MANAGER");
    setToken(null);
    setloggedInUser(null);
    setIsAdmin(false);
    setIsManager(false);
    setIsDialogOpen(false);
    navigate("/login");
    toast.success("Logged out successfully", {
      position: "bottom-center",
      duration: 3000,
    });
  };

  const navLinkClass = (path) =>
    `text-left px-4 py-3 rounded-lg transition font-medium ${
      location.pathname === path
        ? "bg-gray-300 text-gray-900"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
    }`;

  return (
    <>
      <aside className='col-span-1 bg-white rounded-xl p-6 shadow-md flex flex-col justify-between h-full'>
        {/* Top Navigation Buttons */}
        <div className='flex flex-col gap-3 w-full'>
          <h3 className='text-xl font-semibold text-black mb-4'>Navigation</h3>

          <Link
            to='/homepage/expenses'
            className={navLinkClass("/homepage/expenses")}
          >
            Expenses
          </Link>

          <Link
            to='/homepage/analytics'
            className={navLinkClass("/homepage/analytics")}
          >
            Analytics
          </Link>
          {(isAdmin || isManager) && (
            <>
              <Link
                to='/homepage/approvals'
                className={navLinkClass("/homepage/approvals")}
              >
                Approval Panel
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link
                to='/homepage/audit-logs'
                className={navLinkClass("/homepage/audit-logs")}
              >
                Audit Logs
              </Link>

              <Link
                to='/homepage/users'
                className={navLinkClass("/homepage/users")}
              >
                User Management
              </Link>
            </>
          )}
        </div>

        {/* Footer Section with Profile + Logout */}
        <div className='pt-4 mt-4 flex items-center justify-between'>
          <Link
            to='/profile'
            className='flex items-center gap-2 text-gray-700 hover:text-gray-900 transition duration-200 ease-in-out'
            aria-label='Go to profile'
          >
            <AccountCircleIcon fontSize='large' />
            <span className='text-sm'>{fullName}</span>
          </Link>

          <button
            onClick={() => setIsDialogOpen(true)}
            className='text-red-500 hover:text-red-700 text-sm'
          >
            Logout
          </button>
        </div>
      </aside>

      <LogoutDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default SidePanel;
