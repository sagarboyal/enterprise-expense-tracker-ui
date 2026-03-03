import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button, Divider, IconButton, TextField } from "@mui/material"; // Added TextField
import { CheckCircle, Close, Download, Info } from "@mui/icons-material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";

const ApprovalViewModal = ({ open, setOpen, expense, onActionComplete }) => {
  const { loggedInUser } = useMyContext();
  const [approvals, setApprovals] = useState([]);
  const [user, setUser] = useState(null);
  const [docInfo, setDocInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");

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
    if (open) {
      setComment("");
    }
    
    if (!open || !id) return;

    const fetchData = async () => {
      try {
        const [approvalRes, docRes, userRes] = await Promise.all([
          api.get(`/api/expenses/approval-stack/${id}`),
          api.get(`/api/document/${id}`).catch(() => ({ data: null })),
          api.get(`/api/users/${userId}`),
        ]);

        setApprovals(Array.isArray(approvalRes.data) ? approvalRes.data : []);
        setDocInfo(docRes.data?.imageUrl || null);
        setUser(userRes.data);
      } catch (error) {
        console.error("Error fetching expense data:", error);
        toast.error("Failed to load expense details.");
      }
    };

    fetchData();
  }, [id, open, userId]);

  const viewUrl = docInfo;

  const downloadUrl = useMemo(() => {
    if (!docInfo) return null;
    try {
        const url = new URL(docInfo);
        const pathSegments = url.pathname.split("/");
        const uploadIndex = pathSegments.findIndex(
          (segment) => segment === "upload"
        );
        if (uploadIndex !== -1) {
          pathSegments.splice(uploadIndex + 1, 0, "fl_attachment");
          url.pathname = pathSegments.join("/");
        }
        return url.href;
    } catch (error) {
        console.error("Invalid docInfo URL:", error);
        return "#";
    }
  }, [docInfo]);

  const handleAction = async (decision) => {
    if (decision === "REJECT" && !comment.trim()) {
      toast.error("A comment is required to reject an expense.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/api/expenses/approve/${id}`, {
        decision,
        message: comment,
      });

      toast.success(`Expense ${decision.toLowerCase()}ed successfully.`);
      setOpen(false);
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || `Failed to ${decision.toLowerCase()} expense.`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = new Date(expenseDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isActionDisabled = loggedInUser?.id === userId;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => !isSubmitting && setOpen(false)}
      >
        {/* ... (Backdrop and transition setup are the same) ... */}
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="relative w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* ... (Close button and main layout grid are the same) ... */}
                <IconButton aria-label="close" onClick={() => setOpen(false)} sx={{position: 'absolute', right: 12, top: 12, zIndex: 20, color: (theme) => theme.palette.grey[500],}}>
                    <Close />
                </IconButton>
                <div className={`grid ${docInfo ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                  <div className="flex flex-col max-h-[85vh]">
                     {/* ... (Details content panel is the same) ... */}
                    <div className="space-y-6 p-6 overflow-y-auto">
                      <div className="flex justify-between items-start">
                        <div>
                          <Dialog.Title as="h2" className="text-2xl font-bold text-gray-900 pr-10">
                            {title}
                          </Dialog.Title>
                          <p className="text-sm text-gray-500 mt-1">
                            Submitted by: {user?.fullName || "..."}
                          </p>
                        </div>
                        <Status status={status} />
                      </div>
                      <div>
                        <span className="text-4xl font-bold text-gray-900">
                          ₹
                          {Number(amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <Divider />
                      <Section title="Details">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <Detail label="Submitted On" value={formattedDate} />
                          <Detail label="Category" value={category || "N/A"} />
                          <Detail label="Current Level" value={level || "N/A"} />
                        </div>
                      </Section>
                      <Section title="Description">
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {description || "No description provided."}
                        </p>
                      </Section>
                      {approvals.length > 0 && (
                        <Section title="Approval History">
                          <ul className="space-y-3">
                            {approvals.map((a, idx) => (
                              <ApprovalItem key={idx} approval={a} />
                            ))}
                          </ul>
                        </Section>
                      )}
                    </div>
                    
                    {/* Sticky Footer for Actions - UPDATED */}
                    <div className="mt-auto p-6 border-t border-gray-200 bg-gray-50">
                      {!isActionDisabled ? (
                        <div className="space-y-4">
                          <TextField
                            label="Add a comment (required for rejection)"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isSubmitting}
                          />
                          <div className="flex justify-end gap-3">
                            <Button
                              color="error"
                              variant="contained"
                              onClick={() => handleAction("REJECT")}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Rejecting..." : "Reject"}
                            </Button>
                            <Button
                              color="success"
                              variant="contained"
                              onClick={() => handleAction("APPROVE")}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Approving..." : "Approve"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          <Info fontSize="small" />
                          <p>
                            This is your own expense; no action can be taken.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ... (Document Viewer panel is the same) ... */}
                  {docInfo && (
                    <div className="bg-slate-100 p-6 border-l border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Supporting Document
                        </h3>
                        <a href={downloadUrl} download className="flex items-center gap-2 text-sm px-3 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors">
                          <Download fontSize="small" /> Download
                        </a>
                      </div>
                      <div className="border rounded-lg overflow-hidden bg-white">
                        {viewUrl.endsWith(".pdf") ? (
                          <iframe src={viewUrl} className="w-full h-full min-h-[75vh]" title="Document Viewer" />
                        ) : (
                          <img src={viewUrl} alt="Supporting document" className="w-full h-auto object-contain max-h-[75vh]" />
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
  );
};

// --- Helper Sub-components ---
// ... (Detail, Section, Status, ApprovalItem components are the same) ...
const Detail = ({ label, value }) => (
  <div>
    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </h4>
    <p className="text-base text-gray-800">{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-base font-semibold text-gray-800 border-b pb-2 mb-3">
      {title}
    </h3>
    {children}
  </div>
);

const Status = ({ status }) => {
  const statusMap = {
    APPROVED: { bg: "bg-teal-100", text: "text-teal-800", icon: <CheckCircle fontSize="small" />, label: "Approved"},
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", icon: <PendingActionsIcon fontSize="small" />, label: "Pending"},
    REJECTED: { bg: "bg-rose-100", text: "text-rose-800", icon: <Close fontSize="small" />, label: "Rejected"},
  };
  const currentStatus = statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", icon: <Info fontSize="small" />, label: "Unknown"};
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${currentStatus.bg} ${currentStatus.text}`}>
      {currentStatus.icon} {currentStatus.label}
    </div>
  );
};

const ApprovalItem = ({ approval }) => (
  <li className="bg-slate-50 border p-3 rounded-lg text-sm shadow-sm">
    <div className="flex justify-between items-center mb-1">
      <span className="font-semibold text-gray-800">
        Level: {approval.level}
      </span>
      <Status status={approval.status} />
    </div>
    <p className="italic text-gray-600">
      "{approval.comment || "No comment provided."}"
    </p>
    <p className="text-xs text-gray-500 text-right mt-2">
      {new Date(approval.actionTime).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })}
    </p>
  </li>
);

export default ApprovalViewModal;