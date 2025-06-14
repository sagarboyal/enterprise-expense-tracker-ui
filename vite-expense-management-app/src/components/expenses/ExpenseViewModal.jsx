import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Divider } from "@mui/material";
import Status from "./Status";
import { Close, CheckCircle } from "@mui/icons-material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import api from "../../services/api";

function ExpenseViewModal({ open, setOpen, expense }) {
  const [approvals, setApprovals] = useState([]);

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

  if (!expense) return null;

  const {
    title,
    amount,
    expenseDate,
    description,
    category,
    status,
    level,
    message,
  } = expense;

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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <DialogBackdrop className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
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
              <DialogPanel className='relative transform overflow-hidden rounded-2xl bg-white shadow-2xl w-full max-w-2xl p-6 transition-all'>
                <DialogTitle
                  as='h2'
                  className='text-2xl font-semibold text-gray-800 mb-6'
                >
                  {title || "Expense Details"}
                </DialogTitle>

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
                            {new Date(a.actionTime).toLocaleString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className='flex justify-end mt-6'>
                  <Button
                    className='px-5 py-2 bg-slate-800 text-white font-medium rounded-md hover:bg-slate-900'
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

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

export default ExpenseViewModal;
