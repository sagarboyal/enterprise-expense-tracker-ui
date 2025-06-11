import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { Divider } from "@mui/material";
import Status from "./Status";
import { Close, CheckCircle } from "@mui/icons-material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

function ExpenseViewModal({ open, setOpen, expense }) {
  if (!expense) return null;

  const { title, amount, expenseDate, category, status, level, message } =
    expense;

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
              <DialogPanel className='relative transform overflow-hidden rounded-xl bg-white shadow-xl w-full max-w-lg p-6 transition-all'>
                <DialogTitle
                  as='h2'
                  className='text-2xl font-semibold text-gray-800 mb-6'
                >
                  {title || "Unknown Expense"}
                </DialogTitle>

                <div className='flex items-center justify-between mb-4'>
                  <span className='text-2xl font-bold text-gray-900'>
                    ₹{Number(amount).toFixed(2)}
                  </span>
                  {status === "APPROVED" ? (
                    <Status
                      text='Approved'
                      icon={CheckCircle}
                      bg='bg-teal-400'
                      color='bg-teal-700'
                    />
                  ) : status === "PENDING" ? (
                    <Status
                      text='Pending'
                      icon={PendingActionsIcon}
                      bg='bg-yellow-400'
                      color='bg-yellow-700'
                    />
                  ) : status === "REJECTED" ? (
                    <Status
                      text='Rejected'
                      icon={Close}
                      bg='bg-rose-400'
                      color='bg-rose-700'
                    />
                  ) : (
                    <Status
                      text='Unknown Status'
                      icon={Close}
                      bg='bg-gray-400'
                      color='bg-gray-700'
                    />
                  )}
                </div>

                <Divider className='my-4' />

                <div className='grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4'>
                  <div>
                    <h3 className='font-medium text-gray-800'>Date</h3>
                    <p>{formattedDate}</p>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-800'>Time</h3>
                    <p>{formattedTime}</p>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-800'>Category</h3>
                    <p>{category || "Unknown"}</p>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-800'>Level</h3>
                    <p>{level || "Not Specified"}</p>
                  </div>
                </div>

                <div className='mt-4'>
                  <h3 className='text-lg font-medium text-gray-800 mb-2'>
                    Message
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {message || "No additional details provided."}
                  </p>
                </div>

                <div className='flex justify-end mt-6'>
                  <Button
                    className='px-4 py-2 bg-slate-700 text-white font-semibold text-sm rounded-md hover:bg-slate-900'
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

export default ExpenseViewModal;
