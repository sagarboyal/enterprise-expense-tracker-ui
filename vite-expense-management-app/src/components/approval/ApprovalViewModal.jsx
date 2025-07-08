import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button, Divider, TextField } from "@mui/material";
import { CheckCircle, Close, Download } from "@mui/icons-material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";

const ApprovalViewModal = ({ open, setOpen, expense }) => {
  const { loggedInUser } = useMyContext();
  const [approvals, setApprovals] = useState([]);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const [docInfo, setDocInfo] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const {
    userId,
    title,
    amount,
    expenseDate,
    description,
    category,
    status,
    level,
    id,
  } = expense || {};

  useEffect(() => {
    if (!open || !id) return;

    const fetchData = async () => {
      try {
        const approvalRes = await api.get(`/api/expenses/approval-stack/${id}`);
        setApprovals(Array.isArray(approvalRes.data) ? approvalRes.data : []);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }

      try {
        const docRes = await api.get(`/api/document/${id}`);
        setDocInfo(docRes.data?.fileName || null);
      } catch (error) {
        console.error("Error fetching document:", error);
        setDocInfo(null);
      }
    };

    fetchData();
  }, [id, open]);

  useEffect(() => {
    if (!userId) return;
    api
      .get(`/api/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => toast.error("Failed to load user data"));
  }, [userId]);

  const handleAction = async (decision) => {
    try {
      await api.put(`/api/expenses/approve/${id}`, {
        decision,
        message: comment,
      });
      toast.success(`Expense ${decision.toLowerCase()}ed successfully.`);
      setActionModalOpen(false);
      setOpen(false);
    } catch (error) {
      toast.error(`Failed to ${decision.toLowerCase()} expense.`);
    }
  };

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

  const statusMap = {
    APPROVED: { bg: "bg-teal-400", color: "bg-teal-700", text: "Approved" },
    PENDING: { bg: "bg-yellow-400", color: "bg-yellow-700", text: "Pending" },
    REJECTED: { bg: "bg-rose-400", color: "bg-rose-700", text: "Rejected" },
  };

  const statusData = statusMap[status] || {
    bg: "bg-gray-400",
    color: "bg-gray-700",
    text: "Unknown",
  };

  const isActionDisabled = level === "ADMIN" || loggedInUser?.id === userId;

  const downloadUrl = docInfo
    ? `${import.meta.env.VITE_BACKEND_URL}/api/document/download/${docInfo}`
    : null;
  const viewUrl = docInfo
    ? `${import.meta.env.VITE_BACKEND_URL}/api/document/view/${docInfo}`
    : null;

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
                <Dialog.Panel className='relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all'>
                  <div
                    className={`grid ${
                      docInfo ? "grid-cols-2" : "grid-cols-1"
                    } gap-6`}
                  >
                    <div className='space-y-4 overflow-y-auto max-h-[70vh]'>
                      <h2 className='text-2xl font-semibold text-gray-800'>
                        {title}
                      </h2>
                      <p className='text-sm text-gray-600'>User ID: {userId}</p>
                      {user && (
                        <div className='text-sm text-gray-700'>
                          <p>
                            <strong>Name:</strong> {user.fullName}
                          </p>
                          <p>
                            <strong>Email:</strong> {user.email}
                          </p>
                        </div>
                      )}

                      <div className='flex items-center justify-between'>
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

                      <Divider />

                      <div className='grid grid-cols-2 gap-4 text-sm text-gray-700'>
                        <Detail label='Date' value={formattedDate} />
                        <Detail label='Time' value={formattedTime} />
                        <Detail
                          label='Category'
                          value={category || "Unknown"}
                        />
                        <Detail
                          label='Level'
                          value={level || "Not Specified"}
                        />
                      </div>

                      <Section title='Description' content={description} />

                      {approvals.length > 0 && (
                        <div className='mt-6'>
                          <h3 className='text-lg font-medium text-gray-800 mb-2'>
                            Approval History
                          </h3>
                          <ul className='space-y-2'>
                            {approvals.map((a, idx) => (
                              <li
                                key={idx}
                                className='bg-gray-50 border p-3 rounded text-sm shadow-sm'
                              >
                                <div className='flex justify-between mb-1'>
                                  <span className='font-medium'>
                                    Level: {a.level}
                                  </span>
                                  <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
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
                                  {a.comment || "No comment."}
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

                      <div className='flex justify-end gap-3 mt-6'>
                        <Button
                          variant='contained'
                          onClick={() => setActionModalOpen(true)}
                          disabled={
                            level === "ADMIN" || loggedInUser.id === userId
                          }
                        >
                          Take Action
                        </Button>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                      </div>
                    </div>

                    {docInfo && (
                      <div className='space-y-3'>
                        <h3 className='text-lg font-medium text-gray-800'>
                          Document
                        </h3>
                        <a
                          href={downloadUrl}
                          download
                          className='flex items-center gap-2 text-sm px-3 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 w-fit'
                        >
                          <Download fontSize='small' /> Download
                        </a>
                        <div>
                          {viewUrl.endsWith(".pdf") ? (
                            <iframe
                              src={viewUrl}
                              className='w-full h-96 border rounded'
                              title='Document'
                            />
                          ) : (
                            <img
                              src={viewUrl}
                              alt='Document'
                              className='w-full max-h-[400px] object-contain rounded border'
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
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
          <div className='fixed inset-0 flex items-center justify-center p-4'>
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
                <h2 className='text-xl font-semibold mb-4'>Action Comment</h2>
                <TextField
                  label='Comment'
                  fullWidth
                  multiline
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className='flex justify-end gap-4 mt-6'>
                  <Button
                    color='success'
                    variant='contained'
                    onClick={() => handleAction("APPROVE")}
                  >
                    Approve
                  </Button>
                  <Button
                    color='error'
                    variant='contained'
                    onClick={() => handleAction("REJECT")}
                  >
                    Reject
                  </Button>
                  <Button onClick={() => setActionModalOpen(false)}>
                    Cancel
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
    <p className='text-gray-600 truncate'>{value}</p>
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
