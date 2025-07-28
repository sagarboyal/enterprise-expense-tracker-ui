import React, { forwardRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slide,
  IconButton,
  Typography,
} from "@mui/material";
import {
  UserIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  CurrencyRupeeIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { IoClose } from "react-icons/io5";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const initialFilters = {
  fullName: "",
  email: "",
  role: "",
  minAmount: "",
  sortBy: "",
  sortOrder: "asc",
};

const FilterSection = ({ title, children }) => (
  <div className='py-4'>
    <p className='text-sm font-semibold text-slate-600 mb-3'>{title}</p>
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>{children}</div>
  </div>
);

const StyledFormControl = ({ label, icon, children }) => (
  <div className='relative'>
    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10'>
      {icon}
    </div>
    <FormControl fullWidth variant='outlined'>
      <InputLabel
        sx={{
          "&.MuiInputLabel-root": {
            transform: "translate(44px, 16px) scale(1)",
          },
          "&.MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.75)",
          },
        }}
      >
        {label}
      </InputLabel>
      {children}
    </FormControl>
  </div>
);

const UserFilterDialog = ({ open, onClose, onApply }) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onApply(initialFilters);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      TransitionComponent={Transition}
      PaperProps={{
        className: "bg-slate-50 rounded-2xl shadow-xl",
      }}
    >
      <DialogTitle className='flex items-center justify-between p-4 border-b border-slate-200'>
        <div className='flex items-center space-x-3'>
          <div className='h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600'>
            <FunnelIcon className='h-6 w-6' />
          </div>
          <Typography variant='h6' className='font-bold text-slate-800'>
            Advanced Filters
          </Typography>
        </div>
        <IconButton
          onClick={onClose}
          aria-label='Close'
          className='text-slate-500 hover:text-slate-800'
        >
          <IoClose />
        </IconButton>
      </DialogTitle>
      <DialogContent className='p-4'>
        <FilterSection title='Filter by Details'>
          <TextField
            name='fullName'
            label='Full Name'
            value={filters.fullName}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <UserIcon className='h-5 w-5 text-slate-400 mr-2' />
              ),
            }}
          />
          <TextField
            name='email'
            label='Email'
            value={filters.email}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <EnvelopeIcon className='h-5 w-5 text-slate-400 mr-2' />
              ),
            }}
          />
          <StyledFormControl
            label='Role'
            icon={<BriefcaseIcon className='h-5 w-5 text-slate-400' />}
          >
            <Select
              name='role'
              value={filters.role}
              onChange={handleChange}
              label='Role'
              className='pl-8'
            >
              <MenuItem value=''>
                <em>All Roles</em>
              </MenuItem>
              <MenuItem value='ROLE_ADMIN'>Admin</MenuItem>
              <MenuItem value='ROLE_MANAGER'>Manager</MenuItem>
              <MenuItem value='ROLE_EMPLOYEE'>User</MenuItem>
            </Select>
          </StyledFormControl>
          <TextField
            name='minAmount'
            label='Min Expenses'
            type='number'
            value={filters.minAmount}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <CurrencyRupeeIcon className='h-5 w-5 text-slate-400 mr-2' />
              ),
            }}
          />
        </FilterSection>
        <div className='border-t border-slate-200 -mx-4'></div>
        <FilterSection title='Sort Options'>
          <StyledFormControl
            label='Sort By'
            icon={<ArrowsUpDownIcon className='h-5 w-5 text-slate-400' />}
          >
            <Select
              name='sortBy'
              value={filters.sortBy}
              onChange={handleChange}
              label='Sort By'
              className='pl-8'
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value='fullName'>Name</MenuItem>
              <MenuItem value='totalExpenses'>Total Expenses</MenuItem>
            </Select>
          </StyledFormControl>
          <StyledFormControl
            label='Order'
            icon={
              filters.sortOrder === "asc" ? (
                <ArrowUpIcon className='h-5 w-5 text-slate-400' />
              ) : (
                <ArrowDownIcon className='h-5 w-5 text-slate-400' />
              )
            }
          >
            <Select
              name='sortOrder'
              value={filters.sortOrder}
              onChange={handleChange}
              label='Order'
              className='pl-8'
            >
              <MenuItem value='asc'>Ascending</MenuItem>
              <MenuItem value='desc'>Descending</MenuItem>
            </Select>
          </StyledFormControl>
        </FilterSection>
      </DialogContent>
      <DialogActions className='p-4 flex justify-between border-t border-slate-200'>
        <button
          onClick={handleReset}
          className='font-semibold px-4 py-2 rounded-lg text-slate-600 bg-slate-200 hover:bg-slate-300 transition-colors duration-200 flex items-center gap-2'
        >
          <XMarkIcon className='h-5 w-5' />
          Reset Filters
        </button>
        <div className='space-x-2'>
          <button
            onClick={onClose}
            className='font-semibold px-6 py-2 rounded-lg text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-colors duration-200'
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className='font-semibold px-6 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300'
          >
            Apply Filters
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default UserFilterDialog;
