import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FaEnvelope, FaPlus, FaSearch, FaUser } from "react-icons/fa";
import api from "../../services/api";
import ViewInvoiceModal from "./ViewInvoiceModal";
import toast from "react-hot-toast";

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

const InvoiceCardSkeleton = () => (
  <Card sx={{ borderRadius: "16px", boxShadow: 3 }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Skeleton variant='text' width='40%' />
        <Skeleton
          variant='rectangular'
          width={80}
          height={24}
          sx={{ borderRadius: "8px" }}
        />
      </Box>
      <Skeleton variant='text' width='60%' sx={{ mb: 1 }} />
      <Skeleton variant='text' width='80%' />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Skeleton variant='text' width='30%' height={40} />
        <Skeleton
          variant='rectangular'
          width={100}
          height={40}
          sx={{ borderRadius: "12px" }}
        />
      </Box>
    </CardContent>
  </Card>
);

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

const InvoiceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [filters, setFilters] = useState({ search: "", status: "ALL" });

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchInvoices = useCallback(async (pageNumber, currentFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNumber - 1,
        size: 12,
        search: currentFilters.search,
        sortOrder: "desc",
      });
      if (currentFilters.status !== "ALL")
        params.append("status", currentFilters.status);
      const response = await api.get(
        `/api/admin/users/invoice?${params.toString()}`
      );
      if (response.data && Array.isArray(response.data.content)) {
        setInvoices(response.data.content);
        setPagination({
          page: response.data.pageNumber + 1,
          totalPages: response.data.totalPages,
        });
      } else {
        toast.error("Failed to parse invoice data.");
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("An error occurred while fetching invoices.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvoices(1, filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchInvoices]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (event, newPage) => {
    fetchInvoices(newPage, filters);
  };

  const handleOpenCreateModal = () => {
    setNewUserEmail("");
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    if (isCreating) return;
    setCreateModalOpen(false);
  };

  const handleCreateInvoice = async () => {
    if (!newUserEmail || !/\S+@\S+\.\S+/.test(newUserEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsCreating(true);
    try {
      const userResponse = await api.get(`/api/users?email=${newUserEmail}`);

      if (!userResponse.data?.content?.length) {
        toast.error(`No user found with email: ${newUserEmail}`);
        setIsCreating(false);
        return;
      }

      const user = userResponse.data.content[0];
      const userId = user.id;

      await api.get(`/api/invoice/generate/${userId}`);

      toast.success("Invoice generated successfully!");
      handleCloseCreateModal();
      fetchInvoices(1, filters);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error(error.response?.data?.message || "Failed to create invoice.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f7f9fc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth='xl'>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant='h4'
            sx={{ fontWeight: "bold", color: "#1a202c" }}
          >
            Invoices
          </Typography>
          <Button
            variant='contained'
            startIcon={<FaPlus />}
            onClick={handleOpenCreateModal}
            sx={{
              bgcolor: "#4f46e5",
              "&:hover": { bgcolor: "#4338ca" },
              borderRadius: "12px",
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Create Invoice
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <TextField
            name='search'
            value={filters.search}
            onChange={handleFilterChange}
            placeholder='Search by name or invoice #'
            variant='outlined'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <FaSearch color='#9ca3af' />
                </InputAdornment>
              ),
            }}
            sx={{
              flexGrow: 1,
              bgcolor: "white",
              borderRadius: "12px",
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          />
          <Select
            name='status'
            value={filters.status}
            onChange={handleFilterChange}
            sx={{
              minWidth: 180,
              bgcolor: "white",
              borderRadius: "12px",
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          >
            <MenuItem value='ALL'>All Statuses</MenuItem>
            <MenuItem value='IN_PROGRESS'>In Progress</MenuItem>
            <MenuItem value='GENERATED'>Generated</MenuItem>
          </Select>
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            Array.from(new Array(12)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <InvoiceCardSkeleton />
              </Grid>
            ))
          ) : invoices.length > 0 ? (
            invoices.map((inv) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={inv.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px 0 rgba(0,0,0,0.05)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 24px 0 rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant='h6'
                        sx={{ fontWeight: "bold", color: "#374151" }}
                      >
                        #{inv.invoiceNumber}
                      </Typography>
                      <StatusChip status={inv.status} size='small' />
                    </Box>
                    <Box
                      sx={{
                        my: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          color: "#6b7280",
                        }}
                      >
                        <FaUser />
                        <Typography variant='body2' noWrap>
                          {inv.user?.fullName || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          color: "#6b7280",
                        }}
                      >
                        <FaEnvelope />
                        <Typography variant='body2' noWrap>
                          {inv.user?.email || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant='caption'
                      sx={{ color: "#9ca3af", mb: 2 }}
                    >
                      Generated:{" "}
                      {new Date(inv.generatedAt).toLocaleDateString("en-IN")}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: "auto",
                      }}
                    >
                      <Typography
                        variant='h5'
                        sx={{ fontWeight: "bold", color: "#111827" }}
                      >
                        ₹{inv.totalAmount?.toFixed(2)}
                      </Typography>
                      <Button
                        variant='outlined'
                        size='medium'
                        onClick={() => setSelectedInvoice(inv)}
                        sx={{
                          borderRadius: "12px",
                          textTransform: "none",
                          borderColor: "#d1d5db",
                          color: "#374151",
                          "&:hover": {
                            borderColor: "#4f46e5",
                            bgcolor: "rgba(79, 70, 229, 0.04)",
                          },
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: "center",
                  py: 10,
                  bgcolor: "white",
                  borderRadius: "16px",
                }}
              >
                <Typography variant='h5' sx={{ color: "#4b5563", mb: 1 }}>
                  No Invoices Found
                </Typography>
                <Typography sx={{ color: "#9ca3af" }}>
                  Try adjusting your search or filter criteria.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {pagination.totalPages > 1 && !loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color='primary'
              size='large'
            />
          </Box>
        )}
      </Container>

      {selectedInvoice && (
        <ViewInvoiceModal
          open={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}

      <Dialog
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        maxWidth='sm'
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Create New Invoice
        </DialogTitle>
        <DialogContent>
          <Typography variant='body2' sx={{ mb: 2, color: "text.secondary" }}>
            Enter the email address of the user for whom you want to create a
            new invoice. An invoice will be generated in "In Progress" status.
          </Typography>
          <TextField
            autoFocus
            margin='dense'
            id='email'
            label='User Email Address'
            type='email'
            fullWidth
            variant='outlined'
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder='e.g., user@example.com'
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseCreateModal}
            variant='outlined'
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateInvoice}
            variant='contained'
            disabled={isCreating}
            sx={{ minWidth: 90 }}
          >
            {isCreating ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceDashboard;
