import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button, Divider, TextField } from "@mui/material";
import { CheckCircle, Close } from "@mui/icons-material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";

const ApprovalViewModal = ({ open, setOpen, expense }) => {
  const { loggedInUser } = useMyContext();
  console.log(loggedInUser);

  const {
    userId,
    title,
    amount,
    expenseDate,
    description,
    category,
    status,
    level,
    message,
    id,
  } = expense;
  const [approvals, setApprovals] = useState([]);
  const [user, setUser] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchApprovals = async () => {
      if (!expense?.id || !open) return;

      try {
        const res = await api.get(`/api/expenses/approval-stack/${expense.id}`);
        setApprovals(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching approvals:", err);
        setApprovals([]);
      }
    };

    fetchApprovals();
  }, [expense?.id, open]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`/api/users/${userId}`);
        setUser(res.data);
      } catch (error) {
        toast.error("Error fetching user data");
      }
    };

    fetchUser();
  }, [userId]);

  const handleAction = async (decision) => {
    try {
      const payload = {
        decision,
        message: comment,
      };
      await api.put(`/api/expenses/approve/${id}`, payload);
      toast.success(`Expense ${decision.toLowerCase()}ed successfully.`);
      setActionModalOpen(false);
      setOpen(false);
    } catch (error) {
      toast.error(`Failed to ${decision.toLowerCase()} expense.`);
      console.error(error);
    }
  };

  if (!expense) return null;

  const formattedDate = new Date(expenseDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = new Date(expenseDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const statusColorMap = {
    APPROVED: { bg: "bg-teal-400", color: "bg-teal-700", text: "Approved" },
    PENDING: { bg: "bg-yellow-400", color: "bg-yellow-700", text: "Pending" },
    REJECTED: { bg: "bg-rose-400", color: "bg-rose-700", text: "Rejected" },
  };

  const statusData = statusColorMap[status] || {
    bg: "bg-gray-400",
    color: "bg-gray-700",
    text: "Unknown",
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <div className='relative transform rounded-2xl bg-white shadow-2xl w-full max-w-2xl transition-all'>
                  <div className='max-h-[80vh] overflow-y-auto p-6'>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
                      {title || "Expense Details"}
                    </h2>

                    {user && (
                      <div className='mb-4 text-sm text-gray-700'>
                        <p>
                          <strong>User:</strong> {user.fullName}
                        </p>
                        <p>
                          <strong>Email:</strong> {user.email}
                        </p>
                      </div>
                    )}

                    <div className='flex items-center justify-between mb-4'>
                      <span className='text-3xl font-bold text-gray-900'>
                        ₹{Number(amount).toFixed(2)}
                      </span>
                      <Status
                        text={statusData.text}
                        icon={
                          status === "APPROVED"
                            ? CheckCircle
                            : status === "PENDING"
                            ? PendingActionsIcon
                            : Close
                        }
                        bg={statusData.bg}
                        color={statusData.color}
                      />
                    </div>

                    <Divider className='my-4' />

                    <div className='grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4'>
                      <Detail label='Date' value={formattedDate} />
                      <Detail label='Time' value={formattedTime} />
                      <Detail label='Category' value={category || "Unknown"} />
                      <Detail label='Level' value={level || "Not Specified"} />
                    </div>

                    <Section title='Description' content={description} />

                    {approvals.length > 0 && (
                      <div className='mt-6'>
                        <h3 className='text-lg font-medium text-gray-800 mb-4'>
                          Approval History
                        </h3>
                        <ul className='space-y-3'>
                          {approvals.map((a, idx) => (
                            <li
                              key={idx}
                              className='border border-gray-200 bg-gray-50 rounded-md p-3 text-sm shadow-sm'
                            >
                              <div className='flex justify-between items-center mb-1'>
                                <span className='text-gray-800 font-medium'>
                                  Level: {a.level}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    a.status === "APPROVED"
                                      ? "bg-teal-100 text-teal-800"
                                      : a.status === "REJECTED"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {a.status}
                                </span>
                              </div>
                              <p className='italic text-gray-600'>
                                {a.comment || "No comment provided."}
                              </p>
                              <p className='text-xs text-gray-500 mt-1'>
                                {new Date(a.actionTime).toLocaleString(
                                  "en-IN",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className='flex justify-end gap-4 mt-6'>
                      <Button
                        className='px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() => setActionModalOpen(true)}
                        disabled={
                          level === "ADMIN" || loggedInUser.id === userId
                        }
                      >
                        Take Action
                      </Button>

                      <Button
                        className='px-5 py-2 bg-slate-800 text-white font-medium rounded-md hover:bg-slate-900'
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={actionModalOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-20'
          onClose={() => setActionModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
          </Transition.Child>
          <div className='fixed inset-0 z-20 flex items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className='bg-white p-6 rounded-xl w-full max-w-md shadow-xl'>
                <h2 className='text-xl font-semibold mb-4'>
                  Add Action Message
                </h2>
                <TextField
                  label='Message'
                  variant='outlined'
                  fullWidth
                  multiline
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className='flex justify-end gap-4 mt-6'>
                  <Button
                    variant='contained'
                    color='success'
                    onClick={() => handleAction("APPROVE")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant='contained'
                    color='error'
                    onClick={() => handleAction("REJECT")}
                  >
                    Reject
                  </Button>
                  <Button onClick={() => setActionModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <h4 className='font-medium text-gray-800'>{label}</h4>
    <p className='text-gray-600'>{value}</p>
  </div>
);

const Section = ({ title, content }) => (
  <div className='mt-4'>
    <h3 className='text-lg font-medium text-gray-800 mb-2'>{title}</h3>
    <p className='text-sm text-gray-600'>
      {content || `No ${title.toLowerCase()} provided.`}
    </p>
  </div>
);

const Status = ({ text, icon: Icon, bg, color }) => (
  <div
    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white ${color}`}
  >
    <Icon fontSize='small' />
    {text}
  </div>
);

export default ApprovalViewModal;
