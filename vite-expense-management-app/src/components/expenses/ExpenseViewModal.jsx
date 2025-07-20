import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Chip,
  Grid,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  DocumentIcon,
  InboxArrowDownIcon,
  TagIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import api from "../../services/api";
import toast from "react-hot-toast";

const Spinner = () => (
  <div className='flex justify-center items-center h-64'>
    <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600'></div>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className='flex flex-col'>
    <dt className='flex items-center gap-2 text-sm font-medium text-gray-500'>
      {icon}
      {label}
    </dt>
    <dd className='text-sm font-semibold text-gray-900'>{value}</dd>
  </div>
);

const ApprovalTimeline = ({ approvals }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case "APPROVED":
        return { Icon: CheckCircleIcon, color: "text-teal-600" };
      case "REJECTED":
        return { Icon: XCircleIcon, color: "text-rose-600" };
      default:
        return { Icon: ClockIcon, color: "text-gray-400" };
    }
  };

  return (
    <div className='space-y-6'>
      {approvals.map((approval, index) => {
        const { Icon, color } = getStatusInfo(approval.status);
        return (
          <div key={index} className='flex items-start gap-4'>
            <Icon className={`h-6 w-6 mt-1 ${color}`} />
            <div className='flex-1 space-y-1'>
              <p className='text-sm font-medium'>
                {approval.approvedByName} -{" "}
                <span className={`font-semibold ${color}`}>
                  {approval.status}
                </span>
              </p>
              <p className='text-xs text-gray-500'>
                {approval.message} –{" "}
                {new Date(approval.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DocumentViewer = ({ documentUrl }) => {
  if (!documentUrl) return null;
  const isPdf = documentUrl.endsWith(".pdf");

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-md font-semibold'>Attached Document</h3>
        <a
          href={documentUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline'
        >
          <ArrowUpTrayIcon className='h-4 w-4' />
          Download
        </a>
      </div>
      <div className='w-full h-64 border rounded-md overflow-hidden'>
        {isPdf ? (
          <iframe
            src={documentUrl}
            className='w-full h-full'
            title='Document'
            frameBorder='0'
          />
        ) : (
          <img
            src={documentUrl}
            alt='Document'
            className='w-full h-full object-contain'
          />
        )}
      </div>
    </div>
  );
};

const ExpenseViewModal = ({ open, onClose, expenseId }) => {
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    if (open && expenseId) {
      setLoading(true);
      api
        .get(`/expenses/${expenseId}`)
        .then((res) => setExpense(res.data))
        .catch(() => toast.error("Failed to fetch expense details"))
        .finally(() => setLoading(false));
    }
  }, [open, expenseId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle className='flex items-center justify-between'>
        <Typography fontWeight={600} fontFamily='Poppins'>
          Expense Details
        </Typography>
        <IconButton onClick={onClose}>
          <IoClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className='space-y-6'>
        {loading || !expense ? (
          <Spinner />
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div className='space-y-6'>
              <dl className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <DetailItem
                  icon={<UserIcon className='h-4 w-4' />}
                  label='User'
                  value={expense.userName}
                />
                <DetailItem
                  icon={<TagIcon className='h-4 w-4' />}
                  label='Category'
                  value={expense.categoryName}
                />
                <DetailItem
                  icon={<CurrencyRupeeIcon className='h-4 w-4' />}
                  label='Amount'
                  value={`₹${expense.amount}`}
                />
                <DetailItem
                  icon={<CalendarIcon className='h-4 w-4' />}
                  label='Date'
                  value={expense.date}
                />
                <DetailItem
                  icon={<DocumentIcon className='h-4 w-4' />}
                  label='Title'
                  value={expense.title}
                />
                <DetailItem
                  icon={<InboxArrowDownIcon className='h-4 w-4' />}
                  label='Status'
                  value={
                    <Chip
                      label={expense.status}
                      color={
                        expense.status === "APPROVED"
                          ? "success"
                          : expense.status === "REJECTED"
                          ? "error"
                          : "warning"
                      }
                      size='small'
                    />
                  }
                />
              </dl>
              <div>
                <h3 className='text-md font-semibold mb-2'>Description</h3>
                <p className='text-sm text-gray-800'>{expense.description}</p>
              </div>
              {expense.approvals?.length > 0 && (
                <div>
                  <h3 className='text-md font-semibold mb-2'>
                    Approval History
                  </h3>
                  <ApprovalTimeline approvals={expense.approvals} />
                </div>
              )}
            </div>
            <DocumentViewer documentUrl={expense.documentUrl} />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' className='font-poppins'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseViewModal;
