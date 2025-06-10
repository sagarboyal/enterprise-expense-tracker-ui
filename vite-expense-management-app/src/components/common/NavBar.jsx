import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/brandlogo-cropped.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useMyContext } from "../../store/ContextApi";
import NotificationDropdown from "./NotificationDropdown";

const NavBar = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  const {
    token,
    setToken,
    setloggedInUser,
    isAdmin,
    setIsAdmin,
    isManager,
    setIsManager,
  } = useMyContext();

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
    navigate("/login");
  };

  return (
    <header className='h-16 bg-white shadow-md px-6 md:px-12 flex items-center justify-between sticky top-0 z-50'>
      {/* Left: Logo */}
      <Link to='/' className='flex items-center gap-3'>
        <img
          src={logo}
          alt='Trex Logo'
          className='max-w-[90px] h-auto object-contain'
        />
      </Link>

      {/* Right: Menu Items */}
      <div className='relative flex items-center gap-4'>
        {/* Company Dropdown */}
        <div className='relative'>
          <button
            onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
            className='text-sm text-black font-medium hover:text-gray-600 transition'
          >
            Company
          </button>

          {companyDropdownOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
              {["Contact", "About Us", "Careers"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(" ", "")}`}
                  className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition'
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Authenticated Navigation */}
        {token && (
          <>
            <Link
              to='/dashboard'
              className='text-sm text-black font-medium hover:text-gray-600 transition'
            >
              Dashboard
            </Link>
            <NotificationDropdown />
          </>
        )}

        {/* Profile / Login */}
        {token ? (
          <div className='relative'>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className='focus:outline-none'
            >
              <AccountCircleIcon
                sx={{ fontSize: 36 }}
                className='text-black hover:text-gray-600 transition'
              />
            </button>

            {profileDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50'>
                <Link
                  to='/profile'
                  className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition'
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-gray-100 transition'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to='/login'
            className='px-5 py-2 bg-black text-white font-semibold rounded-md shadow-md hover:bg-gray-800 transition duration-300'
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default NavBar;
