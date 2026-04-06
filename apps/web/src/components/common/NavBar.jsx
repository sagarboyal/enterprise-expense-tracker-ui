import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useMyContext } from "../../store/ContextApi";
import toast from "react-hot-toast";

import {
  IoLogOutOutline,
  IoChevronDown,
  IoMoonOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";

import logo from "../../assets/brandlogo-cropped.png";
import profileIcon from "../../assets/profile-icon.png";
import NotificationDropdown from "./NotificationDropdown";
import LogoutDialog from "../utils/LogoutDialog";

const NavBar = ({ theme, onToggleTheme }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const { token, setToken, setLoggedInUser, setIsAdmin, setIsManager } =
    useMyContext();

  const isDark = theme === "dark";

  const handleLogout = () => {
    [
      "JWT_TOKEN",
      "USER",
      "IS_ADMIN",
      "IS_MANAGER",
      "IS_FINANCE",
      "X-XSRF-TOKEN",
    ].forEach((item) => localStorage.removeItem(item));
    setToken(null);
    setLoggedInUser(null);
    setIsAdmin(false);
    setIsManager(false);
    setIsDialogOpen(false);
    navigate("/login");
    toast.success("Logged out successfully", {
      style: {
        borderRadius: "10px",
        background: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#fff" : "#0f172a",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid #cbd5e1",
      },
      position: "bottom-center",
    });
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
    <header
      className={`sticky top-0 z-[100] w-full border-b backdrop-blur-xl transition-all duration-300 ${
        isDark
          ? "border-white/5 bg-[#030712]/80"
          : "border-slate-200/80 bg-white/80 shadow-sm"
      }`}
    >
      <div className="mx-auto flex min-h-[4.5rem] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="group flex items-center gap-2 transition-transform active:scale-95"
          >
            <span
              className={`text-2xl font-black tracking-tighter ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              TREX<span className="text-indigo-500">.</span>
            </span>
          </Link>

          {token && (
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                to="/dashboard"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Expenses
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={onToggleTheme}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all active:scale-95 ${
              isDark
                ? "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <IoSunnyOutline className="h-4 w-4" />
            ) : (
              <IoMoonOutline className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isDark ? "Light mode" : "Dark mode"}
            </span>
          </button>

          {token ? (
            <>
              <div ref={notificationDropdownRef} className="relative">
                <NotificationDropdown
                  isOpen={notificationDropdownOpen}
                  setIsOpen={toggleNotificationDropdown}
                />
              </div>

              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className={`group flex items-center gap-2 rounded-full border p-1 pr-3 transition-all hover:bg-white/10 active:scale-95 ${
                    isDark
                      ? "border-white/10 bg-white/5"
                      : "border-slate-200 bg-white shadow-sm hover:bg-slate-50"
                  }`}
                  aria-label="Open profile menu"
                >
                  <img
                    src={profileIcon}
                    alt="Profile"
                    className={`h-8 w-8 rounded-full border object-cover shadow-sm ${
                      isDark ? "border-white/20" : "border-slate-200"
                    }`}
                  />
                  <IoChevronDown
                    className={`transition-transform duration-300 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    } ${profileDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {profileDropdownOpen && (
                  <div
                    className={`animate-in fade-in zoom-in absolute right-0 mt-3 w-56 origin-top-right overflow-hidden rounded-2xl border p-1.5 shadow-2xl ring-1 duration-200 ${
                      isDark
                        ? "border-white/10 bg-[#0f172a] ring-black/5"
                        : "border-slate-200 bg-white ring-slate-200"
                    }`}
                  >
                    <div
                      className={`mb-1 border-b px-3 py-2 ${
                        isDark ? "border-white/5" : "border-slate-100"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Account
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={closeAllDropdowns}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        isDark
                          ? "text-slate-300 hover:bg-white/5 hover:text-white"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <FaUserTie className="h-4 w-4" />
                      </div>
                      <span>Your Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsDialogOpen(true);
                        closeAllDropdowns();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-400 transition-colors hover:bg-rose-500/10"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                        <IoLogOutOutline className="h-5 w-5" />
                      </div>
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={`text-sm font-semibold transition-colors ${
                  isDark
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="hidden items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:shadow-indigo-500/40 active:scale-95 sm:inline-flex"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      <LogoutDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};

export default NavBar;
