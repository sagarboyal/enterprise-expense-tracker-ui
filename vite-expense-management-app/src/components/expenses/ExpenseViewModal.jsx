import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Divider } from "@mui/material";
import Status from "./Status";
import { Close, CheckCircle } from "@mui/icons-material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

function ExpenseViewModal({ open, setOpen, expense }) {
  const { title, amount, expenseDate, category, status, message } = expense;

  return (
    <>
      {/* Modal Dialog */}
      <Dialog
        open={open}
        as='div'
        className='relative z-10 focus:outline-none'
        onClose={() => setOpen(false)}
      >
        {/* The backdrop */}
        <DialogBackdrop className='fixed inset-0 bg-black/30' />

        {/* Full-screen container to center the panel */}
        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            {/* The actual dialog panel */}
            <DialogPanel
              transition
              className='relative transform overflow-hidden rounded-lg bg-white shadow-lg w-100 max-w-lg p-1 transition-all'
            >
              <div className='px-4 pt-6 pb-2'>
                {/* Modal Title */}
                <DialogTitle
                  as='h1'
                  className='text-2xl font-semibold text-gray-800 mb-4'
                >
                  {title || "Unknown Expense"}
                </DialogTitle>

                <div className='space-y-4 text-gray-700'>
                  {/* Expense Information */}
                  <div className='flex items-center justify-between'>
                    {/* Display amount */}
                    <span className='text-xl font-bold text-gray-900'>
                      ₹{Number(amount).toFixed(2)}
                    </span>

                    {/* Display expense status */}
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

                  {/* Divider */}
                  <Divider />

                  {/* Expense Date and Category */}
                  <div className='flex justify-between text-sm text-gray-600'>
                    <div>
                      <h2 className='font-semibold text-gray-800'>Date</h2>
                      <p>{expenseDate || "Unknown Date"}</p>
                    </div>
                    <div>
                      <h2 className='font-semibold text-gray-800'>Category</h2>
                      <p>{category || "Unknown Category"}</p>
                    </div>
                  </div>

                  {/* Expense Message */}
                  <div className='mt-4'>
                    <h2 className='text-lg font-semibold text-gray-800 mb-2'>
                      Message
                    </h2>
                    <p className='text-sm text-gray-600'>
                      {message || "No additional details provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className='flex justify-end px-4 py-4 gap-4'>
                <Button
                  className='px-4 py-2 mt-4 bg-slate-700 text-white font-semibold text-sm border-none rounded-md hover:bg-slate-900'
                  type='button'
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default ExpenseViewModal;
