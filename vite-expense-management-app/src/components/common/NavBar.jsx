import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../assets/brandlogo-cropped.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useMyContext } from "../../store/ContextApi";
import NotificationDropdown from "./NotificationDropdown";

const NavBar = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  const profileDropdownRef = useRef(null);
  const companyDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

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

  const closeAllDropdowns = () => {
    setProfileDropdownOpen(false);
    setCompanyDropdownOpen(false);
    setNotificationDropdownOpen(false);
  };

  const toggleCompanyDropdown = () => {
    setCompanyDropdownOpen((prev) => !prev);
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
    setCompanyDropdownOpen(false);
    setNotificationDropdownOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen((prev) => !prev);
    setProfileDropdownOpen(false);
    setCompanyDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside all dropdowns
      const isOutsideProfile =
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target);
      const isOutsideCompany =
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target);
      const isOutsideNotification =
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target);

      // Close all if clicked outside ANY of the active dropdowns' parent containers
      if (
        (profileDropdownOpen && isOutsideProfile) ||
        (companyDropdownOpen && isOutsideCompany) ||
        (notificationDropdownOpen && isOutsideNotification)
      ) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen, companyDropdownOpen, notificationDropdownOpen]);

  return (
    <header className='h-16 bg-white shadow-lg px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100'>
      {/* Left: Logo */}
      <Link to='/' className='flex items-center gap-3'>
        <img
          src={logo}
          alt='Trex Logo'
          className='max-w-[90px] h-auto object-contain transition duration-200 ease-in-out hover:opacity-80'
        />
      </Link>

      {/* Right: Menu Items */}
      <div className='relative flex items-center gap-3'>
        {" "}
        <div className='relative' ref={companyDropdownRef}>
          <button
            onClick={toggleCompanyDropdown}
            className='text-sm text-dark font-medium transition duration-200 ease-in-out hover:text-gray-600 traslate-transform focus:outline-none'
          >
            Company
          </button>

          {companyDropdownOpen && (
            <div className='absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-down'>
              {["Contact", "About Us", "Careers"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(" ", "")}`}
                  className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition duration-150 ease-in-out focus:outline-none focus:bg-gray-50'
                  onClick={closeAllDropdowns}
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
              className='text-sm text-dark font-medium transition duration-200 ease-in-out hover:text-gray-600 traslate-transform focus:outline-none'
              onClick={closeAllDropdowns}
            >
              Dashboard
            </Link>
            <div ref={notificationDropdownRef}>
              <NotificationDropdown
                isOpen={notificationDropdownOpen}
                setIsOpen={toggleNotificationDropdown}
              />
            </div>
          </>
        )}
        {/* Profile / Login */}
        {token ? (
          <div className='relative' ref={profileDropdownRef}>
            <button
              onClick={toggleProfileDropdown}
              className='focus:outline-none p-1 rounded-full transition duration-200 ease-in-out hover:bg-gray-100'
            >
              <AccountCircleIcon
                sx={{ fontSize: 32 }}
                className='text-gray-700 hover:text-gray-900 transition duration-200 ease-in-out'
              />
            </button>

            {profileDropdownOpen && (
              <div className='absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-down'>
                <Link
                  to='/profile'
                  className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition duration-150 ease-in-out focus:outline-none focus:bg-gray-50'
                  onClick={closeAllDropdowns}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeAllDropdowns();
                  }}
                  className='w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-150 ease-in-out focus:outline-none focus:bg-red-50'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to='/login'
            className='px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            onClick={closeAllDropdowns}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default NavBar;
