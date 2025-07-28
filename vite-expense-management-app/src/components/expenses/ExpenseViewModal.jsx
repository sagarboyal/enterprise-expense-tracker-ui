import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Chip,
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
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, useCallback } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import api from "../../services/api";

const DetailItem = ({ icon, label, value }) => (
  <div className='flex items-start space-x-3 p-3 bg-slate-50 rounded-lg'>
    <div className='flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-600'>
      {icon}
    </div>
    <div>
      <p className='text-sm font-medium text-slate-500'>{label}</p>
      <p className='text-md font-semibold text-slate-800'>{value}</p>
    </div>
  </div>
);

const ApprovalTimeline = ({ approvals }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          Icon: CheckCircleIcon,
          color: "text-emerald-500 bg-emerald-100",
          ring: "ring-emerald-200",
        };
      case "REJECTED":
        return {
          Icon: XCircleIcon,
          color: "text-rose-500 bg-rose-100",
          ring: "ring-rose-200",
        };
      default:
        return {
          Icon: ClockIcon,
          color: "text-amber-500 bg-amber-100",
          ring: "ring-amber-200",
        };
    }
  };

  return (
    <div className='flow-root'>
      <ul className='-mb-8'>
        {approvals?.map((approval, index) => {
          const { Icon, color, ring } = getStatusInfo(approval.status);
          return (
            <li
              key={approval.id || index}
              className='animate-fade-in-up'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className='relative pb-8'>
                {index !== approvals.length - 1 ? (
                  <span
                    className='absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200'
                    aria-hidden='true'
                  />
                ) : null}
                <div className='relative flex items-start space-x-3 pl-4 pt-2'>
                  <div className='relative z-10'>
                    <span
                      className={`h-8 w-8 rounded-full ${color} flex items-center justify-center ring-4 ${ring}`}
                    >
                      <Icon className='h-5 w-5' aria-hidden='true' />
                    </span>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div>
                      <p className='text-sm font-medium text-slate-800'>
                        <span className={`font-bold ${color.split(" ")[0]}`}>
                          {approval.status}
                        </span>
                      </p>
                      <p className='mt-0.5 text-xs text-slate-500'>
                        {new Date(approval.actionTime).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <div className='mt-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-md'>
                      <p>{approval.comment || "No comment provided."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const DocumentViewer = ({ documentUrl, title }) => {
  const renderContent = () => {
    if (!documentUrl) {
      return (
        <div className='flex flex-col justify-center items-center h-full text-slate-500 bg-slate-100'>
          <DocumentIcon className='h-16 w-16 mb-4 text-slate-400' />
          <p className='font-semibold'>No document attached</p>
        </div>
      );
    }

    const isPdf = documentUrl.toLowerCase().endsWith(".pdf");
    const isPlaceholder = documentUrl.startsWith("https://placehold.co");

    const optimizedImageUrl =
      isPdf || isPlaceholder
        ? documentUrl
        : documentUrl.replace(
            /\/upload\/(.*)/,
            "/upload/c_fill,w_600,h_500,f_auto,q_auto/$1"
          );

    return isPdf ? (
      <iframe
        src={optimizedImageUrl}
        className='w-full h-full'
        title={`Document for ${title}`}
        style={{ border: 0 }}
      />
    ) : (
      <img
        src={optimizedImageUrl}
        alt={`Document for ${title}`}
        className='w-full h-full object-contain'
      />
    );
  };

  const createDownloadUrl = () => {
    if (!documentUrl || documentUrl.startsWith("https://placehold.co"))
      return null;
    const sanitizedFilename = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    return documentUrl.replace(
      /\/upload\/(.*)/,
      `/upload/fl_attachment:${sanitizedFilename}/$1`
    );
  };

  const downloadUrl = createDownloadUrl();

  return (
    <div className='bg-white p-4 rounded-xl shadow-sm h-full flex flex-col'>
      <div className='flex items-center justify-between pb-3 border-b border-slate-200'>
        <h3 className='text-lg font-semibold text-slate-800'>
          Attached Document
        </h3>
        {downloadUrl && (
          <a
            href={downloadUrl}
            className='inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors'
          >
            <ArrowDownTrayIcon className='h-5 w-5' />
            Download
          </a>
        )}
      </div>
      <div className='mt-4 flex-grow w-full h-96 rounded-lg overflow-hidden border border-slate-200'>
        {renderContent()}
      </div>
    </div>
  );
};

const ExpenseViewModal = ({ open, onClose, expense }) => {
  const [docUrl, setDocUrl] = useState(null);
  const [docLoading, setDocLoading] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setDocUrl(null);
      setApprovalHistory([]);
      setIsDataLoaded(false);
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!expense) {
      return;
    }

    const fetchAllData = async () => {
      setIsDataLoaded(false);
      setDocLoading(true);
      setHistoryLoading(true);
      setDocUrl(null);
      setApprovalHistory([]);

      const documentPromise = api.get(`/api/document/${expense.id}`);
      const historyPromise = api.get(
        `/api/expenses/approval-stack/${expense.id}`
      );

      const [docResponse, historyResponse] = await Promise.allSettled([
        documentPromise,
        historyPromise,
      ]);

      if (
        docResponse.status === "fulfilled" &&
        docResponse.value.data?.imageUrl
      ) {
        setDocUrl(docResponse.value.data.imageUrl);
      } else {
        console.error("Error fetching document:", docResponse.reason);
        setDocUrl(
          "https://placehold.co/600x400/e2e8f0/475569?text=Document+Not+Found"
        );
      }
      setDocLoading(false);

      if (historyResponse.status === "fulfilled") {
        setApprovalHistory(historyResponse.value.data || []);
      } else {
        console.error(
          "Error fetching approval history:",
          historyResponse.reason
        );
      }
      setHistoryLoading(false);
      setIsDataLoaded(true);
    };

    fetchAllData();
  }, [expense]);

  const detailItems = expense
    ? [
        {
          label: "User",
          value: expense.fullName,
          icon: <UserIcon className='h-5 w-5' />,
        },
        {
          label: "Category",
          value: expense.category,
          icon: <TagIcon className='h-5 w-5' />,
        },
        {
          label: "Amount",
          value: `₹${expense.amount.toLocaleString("en-IN")}`,
          icon: <CurrencyRupeeIcon className='h-5 w-5' />,
        },
        {
          label: "Date",
          value: new Date(expense.expenseDate).toLocaleDateString("en-GB"),
          icon: <CalendarIcon className='h-5 w-5' />,
        },
      ]
    : [];

  const statusInfo = {
    APPROVED: {
      label: "Approved",
      color: "success",
      chip: "bg-emerald-100 text-emerald-800",
    },
    REJECTED: {
      label: "Rejected",
      color: "error",
      chip: "bg-rose-100 text-rose-800",
    },
    PENDING: {
      label: "Pending",
      color: "warning",
      chip: "bg-amber-100 text-amber-800",
    },
  }[expense?.status] || {
    label: "Unknown",
    color: "default",
    chip: "bg-slate-100 text-slate-800",
  };

  const renderContent = () => {
    if (!expense) {
      return (
        <div className='flex justify-center items-center h-full'>
          <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600'></div>
        </div>
      );
    }

    const animationClass = (delay) =>
      isDataLoaded
        ? `animate-fade-in-up style-animation-delay: ${delay}ms`
        : "opacity-0";

    return (
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
        <div className={`lg:col-span-3 space-y-6 ${animationClass(0)}`}>
          <div className='bg-white p-4 rounded-xl shadow-sm'>
            <div className='flex justify-between items-start'>
              <h3 className='text-lg font-semibold text-slate-800'>
                Expense Details
              </h3>
              <Chip
                label={statusInfo.label}
                size='small'
                className={`font-semibold ${statusInfo.chip}`}
              />
            </div>
            <p className='text-sm text-slate-500 mt-1'>{expense.title}</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
              {detailItems.map((item) => (
                <DetailItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
            <div className='mt-4'>
              <p className='text-sm font-medium text-slate-500'>Description</p>
              <p className='text-md text-slate-700 mt-1'>
                {expense.description || "No description provided."}
              </p>
            </div>
          </div>
          <div className='bg-white p-4 rounded-xl shadow-sm flex flex-col'>
            <h3 className='text-lg font-semibold text-slate-800 mb-4'>
              Approval History
            </h3>
            <div className='flex-grow overflow-y-auto max-h-[40vh] pr-2'>
              {historyLoading ? (
                <div className='flex justify-center items-center h-24'>
                  <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-purple-600'></div>
                </div>
              ) : approvalHistory.length > 0 ? (
                <ApprovalTimeline approvals={approvalHistory} />
              ) : (
                <p className='text-sm text-slate-500'>
                  No approval history available.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={`lg:col-span-2 ${animationClass(200)}`}>
          {docLoading ? (
            <div className='flex justify-center items-center w-full h-full rounded-xl bg-slate-50'>
              <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600'></div>
            </div>
          ) : (
            <DocumentViewer documentUrl={docUrl} title={expense.title} />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='xl'
        PaperProps={{ className: "bg-slate-100 rounded-2xl shadow-xl m-4" }}
      >
        <DialogTitle className='flex items-center justify-between p-4 border-b border-slate-200'>
          <div className='flex items-center space-x-3'>
            <div className='h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600'>
              <ReceiptPercentIcon className='h-6 w-6' />
            </div>
            <Typography variant='h6' className='font-bold text-slate-800'>
              Expense Details
            </Typography>
          </div>
          <IconButton
            onClick={handleClose}
            aria-label='Close'
            className='text-slate-500 hover:text-slate-800'
          >
            <IoClose />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-4 md:p-6'>{renderContent()}</DialogContent>
        <DialogActions className='p-4 border-t border-slate-200'>
          <button
            onClick={handleClose}
            className='font-semibold px-6 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExpenseViewModal;
