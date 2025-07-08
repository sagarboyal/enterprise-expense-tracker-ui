import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import api from "../../services/api";
import ApprovalViewModal from "./ApprovalViewModal";

const ApprovalTable = ({ approvals = [], loading }) => {
  const [userMap, setUserMap] = useState({});
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const ids = [...new Set(approvals.map((a) => a.userId).filter(Boolean))];
      const map = {};
      for (let id of ids) {
        try {
          const res = await api.get(`/api/users/${id}`);
          map[id] = res.data;
        } catch (e) {
          map[id] = { fullName: "Unknown User", email: "N/A" };
        }
      }
      setUserMap(map);
    };

    if (approvals.length > 0) fetchUsers();
  }, [approvals]);

  const handleViewDetails = async (item) => {
    try {
      const userRes = await api.get(`/api/users/${item.userId}`);
      setSelectedApproval({ ...item, user: userRes.data });
      setOpenDetail(true);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  const getStatusColor = (status, level) => {
    if (status === "APPROVED" && level === "MANAGER") {
      return "bg-yellow-100 text-yellow-700";
    }

    return status === "APPROVED"
      ? "bg-teal-100 text-teal-700"
      : status === "REJECTED"
      ? "bg-rose-100 text-rose-700"
      : "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <div className='text-center text-gray-500 py-8 font-[Poppins]'>
        Loading...
      </div>
    );
  }

  if (!approvals.length) {
    return (
      <div className='text-center text-gray-400 py-8 font-[Poppins]'>
        No pending approvals.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto border border-gray-200 rounded-xl shadow-sm font-[Poppins]'>
      <table className='min-w-full text-sm text-left'>
        <thead className='bg-gray-50 text-gray-600 uppercase text-xs tracking-wider'>
          <tr>
            <th className='px-6 py-3'>Title</th>
            <th className='px-6 py-3'>Amount</th>
            <th className='px-6 py-3'>Requested By</th>
            <th className='px-6 py-3'>Status</th>
            <th className='px-6 py-3 text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {approvals.map((item, index) => (
            <tr
              key={item.id}
              className='border-t hover:bg-indigo-50 transition duration-200 cursor-pointer'
            >
              <td className='px-6 py-4 font-bold text-gray-800'>
                {index + 1}. {item.title || item.expense?.title || "—"}
              </td>
              <td className='px-6 py-4 text-gray-700'>
                ₹{item.amount || item.expense?.amount || "—"}
              </td>
              <td className='px-6 py-4'>
                {item.userId ? (
                  userMap[item.userId] ? (
                    <div className='flex flex-col'>
                      <span className='font-semibold text-gray-800'>
                        {userMap[item.userId]?.fullName}
                      </span>
                      <span className='text-gray-500 text-xs'>
                        {userMap[item.userId]?.email}
                      </span>
                    </div>
                  ) : (
                    <span className='text-gray-400 italic'>Loading...</span>
                  )
                ) : (
                  <span className='text-red-500'>No user ID</span>
                )}
              </td>
              <td className='px-6 py-4'>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    item.status,
                    item.level
                  )}`}
                >
                  {getStatusLabel(item.status, item.level)}
                </span>
              </td>
              <td className='px-6 py-4 text-center'>
                <button
                  onClick={() => handleViewDetails(item)}
                  className='inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-800 transition duration-200'
                >
                  <FaEye className='text-gray-600 text-xs' />
                  View Application
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      {selectedApproval && (
        <ApprovalViewModal
          open={openDetail}
          setOpen={setOpenDetail}
          expense={selectedApproval}
        />
      )}
    </div>
  );
};

const getStatusLabel = (status, level) => {
  if (status === "APPROVED" && level === "MANAGER") {
    return "Partially Approved";
  }
  return status || "PENDING";
};

export default ApprovalTable;
