import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useMyContext } from "../../store/ContextApi";
import toast from "react-hot-toast";

import { IoLogOutOutline } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";

import logo from "../../assets/brandlogo-cropped.png";
import profileIcon from "../../assets/profile-icon.png";
import NotificationDropdown from "./NotificationDropdown";
import LogoutDialog from "../utils/LogoutDialog";

const NavBar = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const { token, setToken, setLoggedInUser, setIsAdmin, setIsManager } =
    useMyContext();

  const handleLogout = () => {
    [
      "JWT_TOKEN",
      "USER",
      "CSRF_TOKEN",
      "IS_ADMIN",
      "IS_MANAGER",
      "X-XSRF-TOKEN",
    ].forEach((item) => localStorage.removeItem(item));
    setToken(null);
    setLoggedInUser(null);
    setIsAdmin(false);
    setIsManager(false);
    setIsDialogOpen(false);
    navigate("/login");
    toast.success("Logged out successfully", { position: "bottom-center" });
  };

  const toggleProfileDropdown = () => setProfileDropdownOpen((prev) => !prev);
  const toggleNotificationDropdown = () =>
    setNotificationDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAllDropdowns = () => {
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
  };

  return (
    <header className='h-16 bg-white shadow-sm px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50'>
      <div className='flex items-center gap-4'>
        <Link to='/' className='flex-shrink-0'>
          <img src={logo} alt='Trex Logo' className='h-10 w-auto' />
        </Link>
      </div>

      <div className='flex items-center gap-4'>
        {token ? (
          <>
            <div ref={notificationDropdownRef}>
              <NotificationDropdown
                isOpen={notificationDropdownOpen}
                setIsOpen={toggleNotificationDropdown}
              />
            </div>

            <div className='relative' ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className='rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                aria-label='Open profile menu'
              >
                <img
                  src={profileIcon}
                  alt='Profile'
                  className='w-10 h-10 rounded-full object-cover'
                />
              </button>

              {profileDropdownOpen && (
                <div
                  className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 transform opacity-100 scale-100'
                  role='menu'
                  aria-orientation='vertical'
                >
                  <Link
                    to='/profile'
                    onClick={closeAllDropdowns}
                    className='flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    role='menuitem'
                  >
                    <FaUserTie className='w-5 h-5 text-gray-500' />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsDialogOpen(true);
                      closeAllDropdowns();
                    }}
                    className='w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    role='menuitem'
                  >
                    <IoLogOutOutline className='w-5 h-5 text-gray-500' />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='hidden md:flex items-center gap-4'>
            <Link
              to='/login'
              className='text-sm font-medium text-gray-600 hover:text-indigo-500'
            >
              Sign in
            </Link>
            <Link
              to='/register'
              className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Try it now
            </Link>
          </div>
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
