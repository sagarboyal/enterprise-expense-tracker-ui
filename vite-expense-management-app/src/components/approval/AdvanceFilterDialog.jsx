import {
  Dialog,
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
import { useState, forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const AdvancedFilterDialog = ({ open, onClose, onApply, categories = [] }) => {
  const [filters, setFilters] = useState({
    userId: "",
    title: "",
    categoryName: "",
    status: "",
    level: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      TransitionComponent={Transition}
      transitionDuration={300}
      PaperProps={{
        className: "font-[Poppins]",
        style: { borderRadius: 12 },
      }}
    >
      <DialogTitle>Advanced Filters</DialogTitle>
      <DialogContent className='space-y-4 py-4'>
        <div className='grid grid-cols-2 gap-4'>
          <TextField
            name='userId'
            label='User ID'
            value={filters.userId}
            onChange={handleChange}
            fullWidth
            size='small'
          />
          <TextField
            name='title'
            label='Title'
            value={filters.title}
            onChange={handleChange}
            fullWidth
            size='small'
          />

          <FormControl fullWidth size='small'>
            <InputLabel>Category</InputLabel>
            <Select
              name='categoryName'
              value={filters.categoryName}
              onChange={handleChange}
              label='Category'
            >
              <MenuItem value=''>All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name.charAt(0).toUpperCase() +
                    cat.name.slice(1).toLowerCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size='small'>
            <InputLabel>Status</InputLabel>
            <Select
              name='status'
              value={filters.status}
              onChange={handleChange}
              label='Status'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='APPROVED'>Approved</MenuItem>
              <MenuItem value='REJECTED'>Rejected</MenuItem>
              <MenuItem value='PENDING'>Pending</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name='level'
            label='Level'
            value={filters.level}
            onChange={handleChange}
            fullWidth
            size='small'
          />
          <TextField
            name='startDate'
            label='Start Date'
            type='date'
            value={filters.startDate}
            onChange={handleChange}
            fullWidth
            size='small'
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name='endDate'
            label='End Date'
            type='date'
            value={filters.endDate}
            onChange={handleChange}
            fullWidth
            size='small'
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name='minAmount'
            label='Min Amount'
            value={filters.minAmount}
            onChange={handleChange}
            fullWidth
            size='small'
            type='number'
          />
          <TextField
            name='maxAmount'
            label='Max Amount'
            value={filters.maxAmount}
            onChange={handleChange}
            fullWidth
            size='small'
            type='number'
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
              <MenuItem value='createdAt'>Created At</MenuItem>
              <MenuItem value='amount'>Amount</MenuItem>
              <MenuItem value='title'>Title</MenuItem>
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
    </Dialog>
  );
};

export default AdvancedFilterDialog;
