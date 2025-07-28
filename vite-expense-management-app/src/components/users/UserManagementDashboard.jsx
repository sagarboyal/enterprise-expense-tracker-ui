import { useEffect, useState, forwardRef } from "react";
import api from "../../services/api";
import {
  Container,
  Card,
  Button,
  CardContent,
  CardActions,
  CardHeader,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slide,
  Typography,
  Box,
  Avatar,
  Chip,
  Skeleton,
  Snackbar,
  Stack,
  Menu,
  ListItemIcon,
  Divider,
  Alert as MuiAlert,
} from "@mui/material";
import {
  FilterList,
  Visibility,
  AdminPanelSettings,
  Delete,
  Group,
  MoreVert,
  Email,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import UserFilterDialog from "./UserFilterDialog";
import UserViewDialog from "./UserViewDialog";

// Custom Alert component for Snackbar
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const UserCard = ({ user, onUpdateRole, onDelete, onView }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleUpdateRole = () => {
    onUpdateRole(user.id);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(user.id);
    handleMenuClose();
  };

  const getRoleChipColor = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "error";
      case "ROLE_MANAGER":
        return "warning";
      default:
        return "info";
    }
  };

  return (
      <motion.div
          layout
          initial={{opacity: 0, scale: 0.95}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.3, ease: "easeOut"}}
      >
        <Card
            sx={{
              borderRadius: 4,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0px 10px 20px -5px rgba(0,0,0,0.1)",
              },
            }}
        >
          <CardHeader
              avatar={
                <Avatar sx={{bgcolor: "primary.light", color: "white"}}>
                  {user.fullName.charAt(0)}
                </Avatar>
              }
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVert/>
                </IconButton>
              }
              title={
                <Typography variant='h6' component='p' noWrap fontWeight="600">
                  {user.fullName}
                </Typography>
              }
              subheader={
                <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                  <Email sx={{fontSize: '1rem'}}/>
                  <Typography variant='body2' noWrap>
                    {user.email}
                  </Typography>
                </Box>
              }
          />
          <CardContent sx={{flexGrow: 1, pt: 0}}>
            <Stack spacing={1.5}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Current Role
                </Typography>
                <Chip
                    label={user.role}
                    color={getRoleChipColor(user.role)}
                    size='small'
                    sx={{fontWeight: 'medium'}}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Total Expenses
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  ₹{user.totalExpenses?.toLocaleString() || 0}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
          <Divider light/>
          <CardActions sx={{justifyContent: "center"}}>
            <Button
                fullWidth
                onClick={() => onView(user)}
                startIcon={<Visibility/>}
                sx={{
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': {bgcolor: 'action.hover'}
                }}
            >
              View Full Details
            </Button>
          </CardActions>
          <Menu
              anchorEl={menuAnchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
          >
            <MenuItem onClick={handleUpdateRole}>
              <ListItemIcon>
                <AdminPanelSettings fontSize="small"/>
              </ListItemIcon>
              Update Role
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{color: "error.main"}}>
              <ListItemIcon>
                <Delete fontSize="small" color="error"/>
              </ListItemIcon>
              Delete User
            </MenuItem>
          </Menu>
        </Card>
      </motion.div>
  );
};

// Skeleton Loader Component
const LoadingSkeleton = () => (
    <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
      {Array.from(new Array(6)).map((_, index) => (
          <Card
              key={index}
              sx={{ borderRadius: 4, boxShadow: "rgba(0, 0, 0, 0.05) 0px 4px 12px" }}
          >
            <CardHeader
                avatar={
                  <Skeleton
                      animation='wave'
                      variant='circular'
                      width={40}
                      height={40}
                  />
                }
                title={
                  <Skeleton
                      animation='wave'
                      height={20}
                      width='80%'
                      style={{ marginBottom: 6 }}
                  />
                }
                subheader={<Skeleton animation='wave' height={15} width='40%' />}
            />
            <CardContent>
              <Skeleton animation='wave' height={15} style={{ marginBottom: 6 }} />
              <Skeleton animation='wave' height={15} width='80%' />
            </CardContent>
          </Card>
      ))}
    </div>
);

// Main Component
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  // Dialog states
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [viewedUser, setViewedUser] = useState(null);
  const [roleUpdateState, setRoleUpdateState] = useState({
    open: false,
    userId: null,
    role: "",
    action: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchUsers = async (pageNumber = 1, appliedFilters = {}) => {
    setLoading(true);
    const queryParams = {
      pageNumber: pageNumber - 1,
      pageSize: 9,
      sortBy: "fullName",
      sortOrder: "asc",
      ...appliedFilters,
    };

    try {
      const res = await api.get("/api/users", { params: queryParams });
      setUsers(res.data.content);
      setPage(res.data.pageNumber + 1);
      setTotalPages(res.data.totalPages);
    } catch (e) {
      setSnackbar({ open: true, message: "Failed to fetch users.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, filters);
  }, [filters]);

  const handleApplyFilters = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
    fetchUsers(value, filters);
  };

  const handleRoleUpdate = async () => {
    const { userId, role, action } = roleUpdateState;
    if (!userId || !role || !action) return;

    try {
      await api.patch(`/api/users/${userId}/roles`, { role, action });
      setSnackbar({ open: true, message: "User role updated successfully!", severity: "success" });
      // Refresh the current page
      fetchUsers(page, filters);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update role.", severity: "error" });
    } finally {
      setRoleUpdateState({ open: false, userId: null, role: "", action: "" });
    }
  };

  const handleDeleteUser = async () => {
    const { userId } = deleteDialog;
    if (!userId) return;

    try {
      await api.delete(`/api/users/${userId}`);
      setSnackbar({ open: true, message: `User with: ${userId} deleted successfully.`, severity: "success" });
      const newTotalUsers = (totalPages * 9) - 1;
      const newTotalPages = Math.ceil(newTotalUsers / 9);
      if (page > newTotalPages) {
        setPage(newTotalPages);
        fetchUsers(newTotalPages > 0 ? newTotalPages : 1, filters);
      } else {
        fetchUsers(page, filters);
      }
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to delete user.", severity: "error" });
    } finally {
      setDeleteDialog({ open: false, userId: null });
    }
  };

  const openRoleDialog = (userId) => {
    setRoleUpdateState({ open: true, userId: userId, role: "", action: "" });
  };

  const openDeleteDialog = (userId) => {
    setDeleteDialog({ open: true, userId: userId });
  };


  return (
      <Container maxWidth='xl' sx={{ py: 4, fontFamily: "Poppins" }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
          <Typography variant='h4' component='h1' fontWeight='600'>
            User Management
          </Typography>
          <Button
              variant='outlined'
              onClick={() => setFilterDialogOpen(true)}
              startIcon={<FilterList />}
              sx={{
                fontFamily: "Poppins",
                textTransform: "none",
                borderRadius: 2,
                borderColor: "grey.400",
                color: "text.primary",
                "&:hover": {
                  borderColor: "text.primary",
                  backgroundColor: "action.hover",
                },
              }}
          >
            Filter Users
          </Button>
        </Box>

        {loading ? (
            <LoadingSkeleton />
        ) : users.length === 0 ? (
            <Box textAlign='center' mt={10}>
              <Group sx={{ fontSize: 80, color: "grey.400" }} />
              <Typography variant='h6' color='text.secondary' mt={2}>
                No Users Found
              </Typography>
              <Typography color='text.secondary'>
                Try adjusting your filters or adding new users.
              </Typography>
            </Box>
        ) : (
            <>
              <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                {users.map((user) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onView={setViewedUser}
                        onUpdateRole={openRoleDialog}
                        onDelete={openDeleteDialog}
                    />
                ))}
              </div>

              {totalPages > 1 && (
                  <Box display='flex' justifyContent='center' mt={6}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color='primary'
                        shape='rounded'
                        size='large'
                    />
                  </Box>
              )}
            </>
        )}

        {/* Dialogs */}
        <UserFilterDialog
            open={filterDialogOpen}
            onClose={() => setFilterDialogOpen(false)}
            onApply={handleApplyFilters}
        />

        {viewedUser && (
            <UserViewDialog
                user={viewedUser}
                open={!!viewedUser}
                onClose={() => setViewedUser(null)}
            />
        )}

        <Dialog
            open={roleUpdateState.open}
            onClose={() => setRoleUpdateState({ ...roleUpdateState, open: false })}
            fullWidth
            maxWidth='xs'
        >
          <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
            Update User Role
          </DialogTitle>

          <DialogContent dividers>
            <Box sx={{ px: 1, py: 2 }}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                      value={roleUpdateState.role}
                      onChange={(e) =>
                          setRoleUpdateState((prev) => ({ ...prev, role: e.target.value }))
                      }
                      label='Role'
                  >
                    <MenuItem value='ADMIN'>Admin</MenuItem>
                    <MenuItem value='MANAGER'>Manager</MenuItem>
                    <MenuItem value='EMPLOYEE'>User</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Action</InputLabel>
                  <Select
                      value={roleUpdateState.action}
                      onChange={(e) =>
                          setRoleUpdateState((prev) => ({ ...prev, action: e.target.value }))
                      }
                      label='Action'
                  >
                    <MenuItem value='PROMOTE'>Promote</MenuItem>
                    <MenuItem value='DEMOTE'>Demote</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
                variant='outlined'
                onClick={() => setRoleUpdateState({ ...roleUpdateState, open: false })}
            >
              Cancel
            </Button>
            <Button
                onClick={handleRoleUpdate}
                variant='contained'
                disabled={!roleUpdateState.role || !roleUpdateState.action}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>


        <Dialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, userId: null })}
            fullWidth
            maxWidth='xs'
            TransitionComponent={Slide}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this user? This action is permanent.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, userId: null })}>Cancel</Button>
            <Button onClick={handleDeleteUser} variant='contained' color='error'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Feedback Snackbar */}
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Container>
  );
};

export default UserManagement;