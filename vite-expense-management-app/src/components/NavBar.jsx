import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMyContext } from "../store/ContextApi";
import { useState } from "react";
import logo from "../assets/logo.png";
import userIcon from "../assets/icon.svg"; // Replace with your user icon path

const NavBar = () => {
  const [headerToggle, setHeaderToggle] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    <header className='h-headerHeight z-50 text-textColor bg-white shadow-md sticky top-0 flex items-center justify-between px-6'>
      <div className='flex items-center'>
        {/* Left side: Logo and Brand Name */}
        <Link to='/' className='flex items-center gap-2'>
          <img src={logo} alt='logo' className='w-10 h-10 object-cover' />
          <h3 className='text-2xl font-semibold'>Trex</h3>
        </Link>
      </div>

      {/* Navigation Menu */}
      <ul
        className={`lg:static absolute left-0 top-16 w-full lg:w-auto lg:px-0 sm:px-10 px-4 lg:bg-transparent bg-headerColor ${
          headerToggle
            ? "min-h-fit max-h-navbarHeight lg:py-0 py-4 shadow-md shadow-slate-700 lg:shadow-none"
            : "h-0 overflow-hidden"
        } lg:h-auto transition-all duration-300 ease-in-out font-montserrat text-textColor flex lg:flex-row flex-col`}
      >
        <div className='flex items-center ml-6 space-x-10'>
          {isAdmin && (
            <Link to='/admin/users'>
              <li
                className={`py-3 cursor-pointer uppercase hover:text-slate-300 transition duration-200 ${
                  pathName.startsWith("/admin") ? "font-semibold" : ""
                }`}
              >
                Admin
              </li>
            </Link>
          )}
          <Link to='/contact'>
            <li
              className={`py-3 cursor-pointer hover:text-slate-300 transition duration-200 ${
                pathName === "/contact" ? "font-semibold" : ""
              }`}
            >
              Contact
            </li>
          </Link>
          <Link to='/about'>
            <li
              className={`py-3 cursor-pointer hover:text-slate-300 transition duration-200 ${
                pathName === "/about" ? "font-semibold" : ""
              }`}
            >
              About
            </li>
          </Link>
        </div>

        {/* User-Specific Links */}
        <div className='relative'>
          {token ? (
            <div className='flex items-center'>
              {/* User Icon */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className='flex items-center space-x-2 p-2 bg-white rounded-full hover:text-slate-300  transition duration-300'
              >
                <img
                  src={userIcon} // Replace this with the user's profile image or a default icon
                  alt='User'
                  className='w-8 h-8 object-cover rounded-full'
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className='absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg text-black'>
                  <ul>
                    <Link to='/profile'>
                      <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
                        Profile
                      </li>
                    </Link>
                    <li
                      onClick={handleLogout}
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                    >
                      Log out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // Non-logged-in state: Sign In and Register
            <div className='flex space-x-4'>
              <Link to='/login'>
                <button className='py-2 px-4 bg-black text-white font-semibold hover:bg-gray-700 transition duration-300 rounded'>
                  Sign In
                </button>
              </Link>
              <Link to='/register'>
                <button className='py-2 px-4 bg-white text-black font-semibold hover:bg-gray-200 transition duration-300 rounded'>
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </ul>

      {/* Hamburger Icon for Mobile View */}
      <span
        onClick={() => setHeaderToggle(!headerToggle)}
        className='lg:hidden block cursor-pointer text-textColor shadow-md hover:text-slate-400'
      >
        {headerToggle ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 9h16.5m-16.5 6.75h16.5'
            />
          </svg>
        )}
      </span>
    </header>
  );
};

export default NavBar;
