import React, { forwardRef, useState } from "react";
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Slide,
} from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const UserFilterDialog = ({ open, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    fullName: "",
    email: "",
    role: "",
    minAmount: "",
    sortBy: "",
    sortOrder: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      TransitionComponent={Slide}
      transitionDuration={300}
      PaperProps={{
        className: "font-[Poppins]",
        style: { borderRadius: 12 },
      }}
    >
      <DialogTitle className='text-lg font-semibold'>
        Advanced User Filter
      </DialogTitle>
      <DialogContent className='space-y-4 py-4'>
        <div className='grid grid-cols-2 gap-4'>
          <TextField
            name='fullName'
            label='Full Name'
            value={filters.fullName}
            onChange={handleChange}
            fullWidth
            size='small'
          />
          <TextField
            name='email'
            label='Email'
            value={filters.email}
            onChange={handleChange}
            fullWidth
            size='small'
          />
          <FormControl fullWidth size='small'>
            <InputLabel>Role</InputLabel>
            <Select
              name='role'
              value={filters.role}
              onChange={handleChange}
              label='Role'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='ROLE_ADMIN'>Admin</MenuItem>
              <MenuItem value='ROLE_MANAGER'>Manager</MenuItem>
              <MenuItem value='ROLE_EMPLOYEE'>User</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name='minAmount'
            label='Min Expenses'
            type='number'
            value={filters.minAmount}
            onChange={handleChange}
            fullWidth
            size='small'
          />
          <FormControl fullWidth size='small'>
            <InputLabel>Sort By</InputLabel>
            <Select
              name='sortBy'
              value={filters.sortBy}
              onChange={handleChange}
              label='Sort By'
            >
              <MenuItem value=''>None</MenuItem>
              <MenuItem value='fullName'>Name</MenuItem>
              <MenuItem value='totalExpenses'>Total Expenses</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size='small'>
            <InputLabel>Sort Order</InputLabel>
            <Select
              name='sortOrder'
              value={filters.sortOrder}
              onChange={handleChange}
              label='Sort Order'
            >
              <MenuItem value='asc'>Ascending</MenuItem>
              <MenuItem value='desc'>Descending</MenuItem>
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions className='px-6 pb-4'>
        <Button
          variant='outlined'
          onClick={onClose}
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
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={handleApply}
          sx={{
            fontFamily: "Poppins",
            textTransform: "none",
            backgroundColor: "#000",
            "&:hover": {
              backgroundColor: "#111",
            },
          }}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </MuiDialog>
  );
};

export default UserFilterDialog;
