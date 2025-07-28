import React, { useState } from "react";
import { useMyContext } from "../../store/ContextApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserCircleIcon,
  ShieldCheckIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import ProfileUpdateDialog from "./ProfileUpdateDialog";

const getInitials = (name) => {
  if (!name) return "?";
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.slice(0, 2).toUpperCase();
};

const getRoleClass = (role) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-red-100 text-red-700";
    case "manager":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

const Profile = () => {
  const { setToken, loggedInUser, setloggedInUser, setIsAdmin, setIsManager } =
    useMyContext();

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    ["JWT_TOKEN", "USER", "IS_ADMIN", "IS_MANAGER", "X-XSRF-TOKEN"].forEach(
      (item) => localStorage.removeItem(item)
    );
    setToken(null);
    setloggedInUser(null);
    setIsAdmin(false);
    setIsManager(false);
    navigate("/login");
    toast.success("Logged out successfully.");
  };

  if (!loggedInUser) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-100'>
        <div className='p-8 text-center text-gray-600 bg-white rounded-lg shadow-md'>
          <h3 className='text-xl font-semibold'>No User Data Available</h3>
          <p className='mt-2'>Please log in to view your profile.</p>
          <button
            onClick={() => navigate("/login")}
            className='mt-4 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700'
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const { fullName, email, roles } = loggedInUser;

  return (
    <>
      {openUpdateModal && (
        <ProfileUpdateDialog
          isOpen={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
        />
      )}

      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden'>
          <div className='flex flex-col md:flex-row'>
            <div className='w-full md:w-1/4 bg-gray-50 p-6 border-r border-gray-200'>
              <div className='flex flex-col items-center'>
                <div className='relative'>
                  <div className='w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-4xl font-bold mb-4'>
                    {getInitials(fullName)}
                  </div>
                </div>
                <h2 className='text-xl font-bold text-gray-800 text-center'>
                  {fullName}
                </h2>
                <p className='text-sm text-gray-500'>{email}</p>
              </div>
              <nav className='mt-8 space-y-2'>
                <a
                  href='#'
                  className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg'
                >
                  <UserCircleIcon className='h-5 w-5' />
                  Profile
                </a>
                <a
                  href='#'
                  className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg'
                >
                  <ShieldCheckIcon className='h-5 w-5' />
                  Security
                </a>
              </nav>
              <div className='mt-8 pt-6 border-t border-gray-200'>
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center justify-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                >
                  <ArrowLeftOnRectangleIcon className='h-5 w-5' />
                  Logout
                </button>
              </div>
            </div>

            <div className='w-full md:w-3/4 p-8'>
              <div className='flex justify-between items-center pb-4 border-b border-gray-200'>
                <div>
                  <h3 className='text-2xl font-bold text-gray-900'>
                    Profile Information
                  </h3>
                  <p className='text-sm text-gray-500 mt-1'>
                    Your personal details and role within the organization.
                  </p>
                </div>
                <button
                  onClick={() => setOpenUpdateModal(true)}
                  className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  <PencilSquareIcon className='h-4 w-4' />
                  Edit Profile
                </button>
              </div>

              <dl className='mt-6 space-y-6'>
                <div className='flex flex-col sm:flex-row'>
                  <dt className='w-full sm:w-1/4 text-sm font-medium text-gray-500'>
                    Full Name
                  </dt>
                  <dd className='w-full sm:w-3/4 mt-1 sm:mt-0 text-md text-gray-900'>
                    {fullName}
                  </dd>
                </div>
                <div className='flex flex-col sm:flex-row'>
                  <dt className='w-full sm:w-1/4 text-sm font-medium text-gray-500'>
                    Email Address
                  </dt>
                  <dd className='w-full sm:w-3/4 mt-1 sm:mt-0 text-md text-gray-900'>
                    {email}
                  </dd>
                </div>
                <div className='flex flex-col sm:flex-row'>
                  <dt className='w-full sm:w-1/4 text-sm font-medium text-gray-500'>
                    Roles
                  </dt>
                  <dd className='w-full sm:w-3/4 mt-2 sm:mt-0 flex flex-wrap gap-2'>
                    {roles?.map((role, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleClass(
                          role.replace("ROLE_", "")
                        )}`}
                      >
                        {role.replace("ROLE_", "").toLowerCase()}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
