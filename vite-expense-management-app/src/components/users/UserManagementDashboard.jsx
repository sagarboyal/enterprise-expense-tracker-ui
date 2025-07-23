import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Card,
  Button,
  CardContent,
  Pagination,
  Tooltip,
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
} from "@mui/material";
import {
  FilterList,
  Visibility,
  AdminPanelSettings,
  Delete,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import UserFilterDialog from "./UserFilterDialog";
import UserViewDialog from "./UserViewDialog";
import { FaFilter } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleUpdatingId, setRoleUpdatingId] = useState(null);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [roleData, setRoleData] = useState({
    userId: null,
    role: "",
    action: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null,
  });

  const fetchUsers = async (pageNumber = 1, appliedFilters = {}) => {
    setLoading(true);
    const queryParams = {
      pageNumber: pageNumber - 1,
      pageSize: 10,
      sortBy: "fullName",
      sortOrder: "asc",
      ...appliedFilters,
    };

    try {
      const res = await api.get("/api/users", { params: queryParams });
      setUsers(res.data.content);
      setPage(res.data.pageNumber + 1);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchUsers(1, newFilters);
  };

  const handleRoleUpdate = async () => {
    const { userId, role, action } = roleData;
    setRoleUpdatingId(userId);
    try {
      await api.patch(`/api/users/${userId}/roles`, { role, action });
      fetchUsers(page, filters);
      setOpenRoleModal(false);
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setRoleUpdatingId(null);
    }
  };

  const confirmDeleteUser = (userId) => {
    setDeleteDialog({ open: true, userId });
  };

  const handleDeleteUser = async () => {
    const { userId } = deleteDialog;
    if (!userId) {
      console.warn("No userId to delete");
      return;
    }

    console.log("Deleting user with ID:", userId);

    try {
      await api.delete(`/api/users/${userId}`);
      console.log("User deleted successfully");
      fetchUsers(page, filters);
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setDeleteDialog({ open: false, userId: null });
    }
  };

  return (
      <div className='p-6 font-[Poppins]'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold'>User Management</h2>
          <Button
              variant='outlined'
              onClick={() => setOpenFilter(true)}
              startIcon={<FaFilter />}
              sx={{
                fontFamily: "Poppins",
                textTransform: "none",
                color: "black",
                borderColor: "black",
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "#f3f3f3",
                },
              }}
          >
            Advanced Filter
          </Button>
        </div>

        {loading ? (
            <p className='text-gray-500 animate-pulse'>Loading users...</p>
        ) : users.length === 0 ? (
            <p className='text-gray-500'>No users found.</p>
        ) : (
            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {users.map((user) => (
                  <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                  >
                    <Card className='rounded-2xl shadow-md border border-gray-200 transition'>
                      <CardContent className='space-y-2 text-sm text-gray-700'>
                        <p className='text-gray-800 font-medium text-base'>
                          {user.fullName}
                        </p>
                        <p>
                          <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                          <strong>Role:</strong> {user.role}
                        </p>
                        <p>
                          <strong>Total Expenses:</strong> ₹{user.totalExpenses || 0}
                        </p>

                        <div className='flex justify-end gap-2 pt-2'>
                          <Tooltip title='View Details'>
                            <IconButton onClick={() => setSelectedUser(user)}>
                              <Visibility fontSize='small' />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title='Update Role'>
                            <IconButton
                                onClick={() => {
                                  setRoleData({
                                    userId: user.id,
                                    role: "",
                                    action: "",
                                  });
                                  setOpenRoleModal(true);
                                }}
                            >
                              <AdminPanelSettings fontSize='small' />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title='Delete User'>
                            <IconButton
                                onClick={() => confirmDeleteUser(user.id)}
                                color='error'
                            >
                              <Delete fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
              ))}
            </div>
        )}

        {totalPages > 1 && (
            <div className='flex justify-end mt-6'>
              <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => fetchUsers(value, filters)}
                  color='primary'
                  shape='rounded'
              />
            </div>
        )}

        <UserFilterDialog
            open={openFilter}
            onClose={() => setOpenFilter(false)}
            onApply={handleApplyFilters}
        />

        {selectedUser && (
            <UserViewDialog
                user={selectedUser}
                open={!!selectedUser}
                onClose={() => setSelectedUser(null)}
            />
        )}

        <Dialog
            open={openRoleModal}
            onClose={() => setOpenRoleModal(false)}
            fullWidth
            maxWidth='xs'
        >
          <DialogTitle className='font-[Poppins]'>Update User Role</DialogTitle>
          <DialogContent className='space-y-4 mt-2'>
            <FormControl fullWidth size='small'>
              <InputLabel>Role</InputLabel>
              <Select
                  value={roleData.role}
                  onChange={(e) =>
                      setRoleData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  label='Role'
              >
                <MenuItem value='ADMIN'>Admin</MenuItem>
                <MenuItem value='MANAGER'>Manager</MenuItem>
                <MenuItem value='EMPLOYEE'>User</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size='small'>
              <InputLabel>Action</InputLabel>
              <Select
                  value={roleData.action}
                  onChange={(e) =>
                      setRoleData((prev) => ({ ...prev, action: e.target.value }))
                  }
                  label='Action'
              >
                <MenuItem value='PROMOTE'>Promote</MenuItem>
                <MenuItem value='DEMOTE'>Demote</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions className='px-4 pb-4'>
            <Button onClick={() => setOpenRoleModal(false)} variant='outlined'>
              Cancel
            </Button>
            <Button
                onClick={handleRoleUpdate}
                variant='contained'
                disabled={!roleData.role || !roleData.action}
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
        >
          <DialogTitle className='font-[Poppins]'>Delete User</DialogTitle>
          <DialogContent className='py-4'>
            <Typography className='font-[Poppins]'>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions className='px-4 pb-4'>
            <Button
                onClick={() => setDeleteDialog({ open: false, userId: null })}
                variant='outlined'
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteUser} variant='contained' color='error'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
};

export default UserManagement;
