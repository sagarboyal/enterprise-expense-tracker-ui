import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
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

  const getStatusColor = (status) => {
    return status === "APPROVED"
      ? "bg-teal-100 text-teal-800"
      : status === "REJECTED"
      ? "bg-rose-100 text-rose-800"
      : "bg-yellow-100 text-yellow-800";
  };

  if (loading) {
    return <div className='text-center text-gray-500 py-8'>Loading...</div>;
  }

  if (!approvals.length) {
    return (
      <div className='text-center text-gray-400 py-8'>
        No pending approvals.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto border border-gray-200 rounded-lg shadow'>
      <table className='min-w-full text-sm text-left'>
        <thead className='bg-gray-100 text-gray-600 uppercase text-xs'>
          <tr>
            <th className='px-6 py-3'>Title</th>
            <th className='px-6 py-3'>Amount</th>
            <th className='px-6 py-3'>Requested By</th>
            <th className='px-6 py-3'>Status</th>
            <th className='px-6 py-3 text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {approvals.map((item) => (
            <tr key={item.id} className='border-t hover:bg-gray-50 transition'>
              <td className='px-6 py-4'>
                {item.title || item.expense?.title || "—"}
              </td>
              <td className='px-6 py-4'>
                ₹{item.amount || item.expense?.amount || "—"}
              </td>
              <td className='px-6 py-4'>
                {item.userId ? (
                  userMap[item.userId] ? (
                    <div className='flex flex-col'>
                      <span className='font-medium'>
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
                    item.status
                  )}`}
                >
                  {item.status || "PENDING"}
                </span>
              </td>
              <td className='px-6 py-4 text-center'>
                <Button
                  variant='outlined'
                  onClick={() => handleViewDetails(item)}
                >
                  View Request
                </Button>
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

export default ApprovalTable;
