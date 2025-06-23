import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../assets/brandlogo-cropped.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useMyContext } from "../../store/ContextApi";
import NotificationDropdown from "./NotificationDropdown";
import toast from "react-hot-toast";
import LogoutDialog from "../utils/LogoutDialog";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";
import profileIcon from "../../assets/profile-icon.png";

const NavBar = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
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
    setIsDialogOpen(false);
    navigate("/login");

    toast.success("Logged out successfully", {
      position: "bottom-center",
      duration: 3000,
    });
  };

  const closeAllDropdowns = () => {
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
    setNotificationDropdownOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen((prev) => !prev);
    setProfileDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (profileDropdownOpen &&
          profileDropdownRef.current &&
          !profileDropdownRef.current.contains(event.target)) ||
        (notificationDropdownOpen &&
          notificationDropdownRef.current &&
          !notificationDropdownRef.current.contains(event.target))
      ) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen, notificationDropdownOpen]);

  return (
    <header className='h-16 bg-white shadow-lg px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100'>
      {/* Left Side */}
      <div className='relative flex items-center gap-3'>
        <Link to='/' className='relative'>
          <img
            src={logo}
            alt='Trex Logo'
            className='max-w-[90px] h-auto object-contain transition duration-200 ease-in-out hover:opacity-80'
          />
        </Link>
        <div className='relative font-[Poppins] text-base font-medium pl-1 pt-3'>
          Features
        </div>
      </div>

      {/* Right Side */}
      <div className='relative flex items-center gap-2 ml-auto'>
        {token && (
          <div ref={notificationDropdownRef}>
            <NotificationDropdown
              isOpen={notificationDropdownOpen}
              setIsOpen={toggleNotificationDropdown}
            />
          </div>
        )}

        {token ? (
          <div className='relative' ref={profileDropdownRef}>
            <div className='relative group'>
              <button
                onClick={toggleProfileDropdown}
                className='p-1 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105 focus:outline-none'
                aria-label='Open profile menu'
              >
                <img
                  src={profileIcon}
                  alt='Profile'
                  className='w-10 h-10 rounded-full object-cover transition duration-300 ease-in-out group-hover:brightness-110'
                />
              </button>
            </div>

            {profileDropdownOpen && (
              <div className=' font-[Poppins] text-base font-medium absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-down'>
                <Link
                  to='/profile'
                  className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition duration-150 ease-in-out'
                  onClick={closeAllDropdowns}
                >
                  <div className='flex items-center gap-2'>
                    <FaUserTie className='text-base' />
                    Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setIsDialogOpen(true);
                    closeAllDropdowns();
                  }}
                  className='w-full text-left px-5 py-3 text-sm text-black hover:bg-red-50 hover:text-red-700 transition duration-150 ease-in-out'
                >
                  <div className='flex items-center gap-2'>
                    <IoLogOutOutline className='text-base' />
                    Logout
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to='/login'
              className='font-[Poppins] text-base text-black font-medium transition duration-200 ease-in-out hover:text-gray-600'
              onClick={closeAllDropdowns}
            >
              Sign in
            </Link>
            <Link
              to='/register'
              onClick={closeAllDropdowns}
              className='relative group overflow-hidden px-5 py-2 font-[Poppins] text-base font-medium text-white bg-black rounded-xl'
            >
              <span className='absolute inset-0 bg-gray-500/40 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out rounded-full z-0'></span>
              <span className='relative z-10 transition duration-300'>
                Try it now
              </span>
            </Link>
          </>
        )}
        <LogoutDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleLogout}
        />
      </div>
    </header>
  );
};

export default NavBar;
