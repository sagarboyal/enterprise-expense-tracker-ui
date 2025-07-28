import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import {
  FaFilePdf,
  FaCalendarAlt,
  FaHashtag,
  FaInfoCircle,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../services/api";

const StatusChip = ({ status, size = "medium" }) => {
  const style = {
    IN_PROGRESS: {
      color: "warning.main",
      bgcolor: "rgba(255, 171, 0, 0.1)",
      label: "In Progress",
    },
    GENERATED: {
      color: "success.main",
      bgcolor: "rgba(46, 204, 113, 0.1)",
      label: "Generated",
    },
    PAID: {
      color: "info.main",
      bgcolor: "rgba(52, 152, 219, 0.1)",
      label: "Paid",
    },
    VOID: {
      color: "error.main",
      bgcolor: "rgba(231, 76, 60, 0.1)",
      label: "Void",
    },
    PENDING: {
      color: "warning.main",
      bgcolor: "rgba(255, 171, 0, 0.1)",
      label: "Pending",
    },
    APPROVED: {
      color: "success.main",
      bgcolor: "rgba(46, 204, 113, 0.1)",
      label: "Approved",
    },
    REJECTED: {
      color: "error.main",
      bgcolor: "rgba(231, 76, 60, 0.1)",
      label: "Rejected",
    },
  }[status];

  return (
    <Chip
      label={style?.label || "Unknown"}
      size={size}
      sx={{
        color: style?.color,
        backgroundColor: style?.bgcolor,
        fontWeight: 600,
        borderRadius: "8px",
        border: `1px solid ${style?.color || "#ccc"}`,
      }}
    />
  );
};

const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "#4b5563" }}>
    {icon}
    <Box>
      <Typography variant='caption' sx={{ color: "#6b7280", display: "block" }}>
        {label}
      </Typography>
      <Typography variant='body1' sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const ViewInvoiceModal = ({ invoice, open, onClose }) => {
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  useEffect(() => {
    if (invoice?.id && open) {
      const fetchExpenses = async () => {
        setLoadingExpenses(true);
        try {
          const response = await api.get(
            `/api/users/invoice/expenses/${invoice.id}`
          );
          setExpenses(response.data || []);
        } catch (error) {
          console.error("Error fetching expenses:", error);
          toast.error("Failed to load expense details.");
          setExpenses([]);
        } finally {
          setLoadingExpenses(false);
        }
      };
      void fetchExpenses();
    }
  }, [invoice, open]);

  if (!invoice) return null;

  const handleExport = async () => {
    const toastId = toast.loading("Preparing preview...");

    try {
      let url = invoice.invoiceUrl;

      if (!url) {
        toast.loading("URL not found, regenerating...", { id: toastId });
        const response = await api.get(`/api/users/invoice/re-generate/${invoice.id}`);
        url = response.data.invoiceUrl;
        invoice = response.data;
        if (!url) {
          throw new Error("Failed to regenerate invoice URL.");
        }
      }

      // Replace .pdf with .jpg to get Cloudinary's preview image
      const imagePreviewUrl = url.replace(/\.pdf$/, ".jpg");
      const imageName = imagePreviewUrl.split("/").pop();

      // Fetch the image preview as a blob
      const response = await fetch(imagePreviewUrl);
      if (!response.ok) throw new Error("Failed to fetch image preview.");

      const blob = await response.blob();

      // Create a temporary link to download the image
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = imageName || "invoice-preview.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Image downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error preparing image download:", error);
      toast.error(error.message || "Failed to download image.", { id: toastId });
    }
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='lg'
      fullWidth
      PaperProps={{ sx: { borderRadius: "20px" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
        }}
      >
        <Typography variant='h5' component='div' sx={{ fontWeight: "bold" }}>
          Invoice Details
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "grey.600" }}>
          <MdClose />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3, bgcolor: "#f9fafb" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <DetailItem
              icon={<FaHashtag size={20} />}
              label='Invoice Number'
              value={invoice.invoiceNumber}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DetailItem
              icon={<FaCalendarAlt size={20} />}
              label='Generated At'
              value={new Date(invoice.generatedAt).toLocaleString("en-IN")}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                color: "#4b5563",
              }}
            >
              <FaInfoCircle size={20} />
              <Box>
                <Typography
                  variant='caption'
                  sx={{ color: "#6b7280", display: "block" }}
                >
                  Status
                </Typography>
                <StatusChip status={invoice.status} size='small' />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant='h6' sx={{ fontWeight: "bold", mb: 2 }}>
          User Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DetailItem
              icon={<FaUser size={20} />}
              label='Full Name'
              value={invoice.user?.fullName || "N/A"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailItem
              icon={<FaEnvelope size={20} />}
              label='Email Address'
              value={invoice.user?.email || "N/A"}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant='h6' sx={{ fontWeight: "bold", mb: 2 }}>
          Expense Details
        </Typography>
        {loadingExpenses ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : expenses.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "16px",
              boxShadow: "none",
              border: "1px solid #e5e7eb",
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#f9fafb" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell align='right' sx={{ fontWeight: "bold" }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Expense Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell align='right'>
                      ₹{expense.amount?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(expense.expenseDate).toLocaleDateString(
                        "en-IN"
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={expense.status} size='small' />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ textAlign: "center", my: 4, color: "grey.600" }}>
            No expenses associated with this invoice.
          </Typography>
        )}

        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: "white",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: "bold" }}>
            Total Invoice Amount
          </Typography>
          <Typography
            variant='h4'
            sx={{ fontWeight: "bold", color: "#4f46e5" }}
          >
            ₹{invoice.totalAmount?.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3, bgcolor: "#f9fafb" }}>
        <Button
          variant='outlined'
          onClick={onClose}
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            borderColor: "grey.400",
            color: "grey.700",
          }}
        >
          Close
        </Button>
        <Button
          variant='contained'
          onClick={handleExport}
          startIcon={<FaFilePdf />}
          disabled={invoice.status === "IN_PROGRESS"}
          sx={{
            bgcolor: "#4f46e5",
            "&:hover": { bgcolor: "#4338ca" },
            textTransform: "none",
            borderRadius: "12px",
          }}
        >
          Download Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewInvoiceModal;
