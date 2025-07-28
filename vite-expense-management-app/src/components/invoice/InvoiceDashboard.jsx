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
    IconButton,
    InputAdornment,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Skeleton,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";
import {
    FaPlus,
    FaSearch,
    FaUser,
    FaEnvelope,
} from "react-icons/fa";
import api from "../../services/api";
import ViewInvoiceModal from "./ViewInvoiceModal";
import toast from "react-hot-toast";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CloseIcon from '@mui/icons-material/Close';

const StatusChip = ({ status, size = "medium" }) => {
    const style = {
        IN_PROGRESS: {
            color: "#f39c12",
            bgcolor: "rgba(243, 156, 18, 0.1)",
            label: "In Progress",
        },
        GENERATED: {
            color: "#27ae60",
            bgcolor: "rgba(39, 174, 96, 0.1)",
            label: "Generated",
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
    <Card sx={{ borderRadius: 4, boxShadow: "none", border: "1px solid #e0e0e0" }}>
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} />
            </Box>
            <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
                <Skeleton variant="text" width="30%" height={40} />
                <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 3 }} />
            </Box>
        </CardContent>
    </Card>
);

const NoInvoicesFound = () => {
    return (
        <div className="min-w-7xl flex items-center justify-center pl-4">
            <div className="w-full max-w bg-white shadow-sm rounded-xl border border-gray-200/75 p-8 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-white ring-4 ring-slate-200/50">
                    <DescriptionOutlinedIcon style={{ fontSize: 40 }} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Invoices Found
                </h2>
                <p className="text-gray-500 max-w-xs mx-auto mb-6">
                    It seems there are no invoices to display. Try adjusting your filters or create a new one to get started.
                </p>
            </div>
        </div>
    );
};


const InvoiceDashboard = () => {
    const [loading, setLoading] = React.useState(true);
    const [invoices, setInvoices] = React.useState([]);
    const [selectedInvoice, setSelectedInvoice] = React.useState(null);
    const [pagination, setPagination] = React.useState({ page: 1, totalPages: 0 });
    const [filters, setFilters] = React.useState({ search: "", status: "ALL" });
    const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
    const [newUserEmail, setNewUserEmail] = React.useState("");
    const [isCreating, setIsCreating] = React.useState(false);

    const fetchInvoices = React.useCallback(async (pageNumber, currentFilters) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pageNumber - 1,
                size: 12,
                email: currentFilters.search,
                sortOrder: "desc",
            });
            if (currentFilters.status !== "ALL") params.append("status", currentFilters.status);
            const response = await api.get(`/api/admin/users/invoice?${params.toString()}`);
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

    React.useEffect(() => {
        const timer = setTimeout(() => {
            void fetchInvoices(1, filters);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters, fetchInvoices]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleClearSearch = () => {
        setFilters((prev) => ({ ...prev, search: "" }));
    };

    const handlePageChange = (event, newPage) => {
        void fetchInvoices(newPage, filters);
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
            await api.get(`/api/admin/invoice/generate/${userId}`);
            toast.success("Invoice generated successfully!");
            handleCloseCreateModal();
            void fetchInvoices(1, filters);
        } catch (error) {
            toast.error("🚫 All invoices are already processed or approved.", {
            duration: 4000,
            style: {
                border: '1px solid #f87171',
                padding: '16px',
                color: '#7f1d1d',
                background: '#fef2f2',
            },
        });

        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", py: 5 }}>
            <Container maxWidth="xl">
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#212529" }}>
                        Invoice Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<FaPlus />}
                        onClick={handleOpenCreateModal}
                        sx={{
                            bgcolor: "primary.main",
                            "&:hover": { bgcolor: "primary.dark" },
                            borderRadius: 3,
                            px: 3,
                            py: 1.5,
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: "0 4px 12px 0 rgba(0,0,0,0.1)",
                        }}
                    >
                        Create Invoice
                    </Button>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        display: "flex",
                        gap: 2,
                        mb: 4,
                        flexWrap: "nowrap",
                        borderRadius: 4,
                        border: "1px solid #dee2e6",
                        backgroundColor: "white",
                        alignItems: "center",
                    }}
                >
                    <TextField
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search by example@xyz.com"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaSearch color="#6c757d" />
                                </InputAdornment>
                            ),
                            endAdornment: filters.search && (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="clear search"
                                        onClick={handleClearSearch}
                                        edge="end"
                                        size="small"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            flexGrow: 1,
                            "& .MuiOutlinedInput-root": { borderRadius: 3 },
                            minWidth: 0, // allow shrinking if needed
                        }}
                    />

                    <Select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        size="small"
                        sx={{
                            minWidth: 180,
                            borderRadius: 3,
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#ced4da",
                            },
                        }}
                    >
                        <MenuItem value="ALL">All Statuses</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="GENERATED">Generated</MenuItem>
                    </Select>
                </Paper>

                <Grid container spacing={3}>
                    {loading
                        ? Array.from(new Array(12)).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <InvoiceCardSkeleton />
                            </Grid>
                        ))
                        : invoices.length > 0
                            ? invoices.map((inv) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={inv.id}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            borderRadius: 4,
                                            boxShadow: "none",
                                            border: "1px solid #e9ecef",
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.08)",
                                                borderColor: "primary.main",
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#343a40" }}>
                                                    #{inv.invoiceNumber}
                                                </Typography>
                                                <StatusChip status={inv.status} size="small" />
                                            </Box>
                                            <Box sx={{ my: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#495057" }}>
                                                    <FaUser />
                                                    <Typography variant="body2" noWrap title={inv.user?.fullName || "N/A"}>
                                                        {inv.user?.fullName || "N/A"}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#495057" }}>
                                                    <FaEnvelope />
                                                    <Typography variant="body2" noWrap title={inv.user?.email || "N/A"}>
                                                        {inv.user?.email || "N/A"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="caption" sx={{ color: "#6c757d", mb: 2 }}>
                                                Generated: {new Date(inv.generatedAt).toLocaleDateString("en-IN")}
                                            </Typography>
                                            <Box sx={{ flexGrow: 1 }} />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                                                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#212529" }}>
                                                    ₹{inv.totalAmount?.toFixed(2)}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    onClick={() => setSelectedInvoice(inv)}
                                                    sx={{
                                                        borderRadius: 3,
                                                        textTransform: "none",
                                                        boxShadow: "none",
                                                        bgcolor: "#e9ecef",
                                                        color: "#212529",
                                                        fontWeight: 600,
                                                        "&:hover": { bgcolor: "primary.main", color: "white" },
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                            : <Grid item xs={12}><NoInvoicesFound /></Grid>}
                </Grid>

                {pagination.totalPages > 1 && !loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.page}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                            sx={{ "& .MuiPaginationItem-root": { borderRadius: 2 } }}
                        />
                    </Box>
                )}
            </Container>

            {selectedInvoice && (
                <ViewInvoiceModal open={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} invoice={selectedInvoice} />
            )}

            <Dialog open={isCreateModalOpen} onClose={handleCloseCreateModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem", pb: 1 }}>
                    Create New Invoice
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
                        Enter the user's email to generate a new invoice. The invoice will be created with an "In Progress" status.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="User Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="e.g., user@example.com"
                    />
                </DialogContent>
                <DialogActions sx={{ p: '0 24px 24px' }}>
                    <Button onClick={handleCloseCreateModal} variant="outlined" disabled={isCreating} sx={{textTransform: 'none', borderRadius: 2}}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateInvoice} variant="contained" disabled={isCreating} sx={{ minWidth: 90, textTransform: 'none', borderRadius: 2 }}>
                        {isCreating ? <CircularProgress size={24} color="inherit" /> : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InvoiceDashboard;
