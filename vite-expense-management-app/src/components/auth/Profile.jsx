import { useState } from "react";
import { useMyContext } from "../../store/ContextApi";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfileUpdateDialog from "./ProfileUpdateDialog";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const { setToken, loggedInUser, setloggedInUser, setIsAdmin, setIsManager } =
    useMyContext();

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const navigate = useNavigate();

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
    toast.success("Logged out successfully.");
  };

  if (!loggedInUser) {
    return (
      <div className='p-6 text-center text-gray-600'>
        No user data available.
      </div>
    );
  }

  const { id, fullName, email, roles } = loggedInUser;

  return (
    <>
      {openUpdateModal && (
        <ProfileUpdateDialog
          isOpen={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
        />
      )}

      <div className='h-screen flex items-center justify-center bg-gray-50 px-4'>
        <div className='w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 relative border border-gray-200'>
          <div className='flex flex-col items-center'>
            <AccountCircleIcon
              className='text-gray-400 mb-2'
              style={{ fontSize: 80 }}
            />
            <div className='flex items-center gap-2'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                {fullName}
              </h2>
              <button
                onClick={() => setOpenUpdateModal(true)}
                className='flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:text-white hover:bg-gray-700 transition'
                title='Edit Profile'
              >
                <EditIcon fontSize='small' />
                Edit
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className='space-y-5 text-gray-700'>
            <div className='flex items-center gap-3'>
              <PersonIcon className='text-blue-500' />
              <div>
                <p className='text-sm text-gray-500'>Full Name</p>
                <p className='text-lg font-medium'>{fullName}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <EmailIcon className='text-green-500' />
              <div>
                <p className='text-sm text-gray-500'>Email</p>
                <p className='text-lg font-medium'>{email}</p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <SecurityIcon className='text-yellow-500 mt-1' />
              <div>
                <p className='text-sm text-gray-500 mb-1'>Roles</p>
                <ul className='list-disc ml-5'>
                  {roles?.map((role, idx) => (
                    <li key={idx} className='capitalize'>
                      {role.replace("ROLE_", "").toLowerCase()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer / Logout */}
          <div className='mt-8 text-right'>
            <button
              onClick={handleLogout}
              className='inline-flex items-center gap-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition'
            >
              <LogoutIcon fontSize='small' />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
