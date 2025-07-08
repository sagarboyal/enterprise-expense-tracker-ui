import React, { useState } from "react";
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

const AuditLogFilterDialog = ({ open, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    auditId: "",
    entityName: "",
    entityId: "",
    deviceIp: "",
    action: "",
    performedBy: "",
    startDate: "",
    endDate: "",
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
      TransitionComponent={Slide}
      transitionDuration={300}
      PaperProps={{
        className: "font-[Poppins]",
        style: { borderRadius: 12 },
      }}
    >
      <DialogTitle>Audit Log Filters</DialogTitle>
      <DialogContent className='space-y-4 py-4'>
        <div className='grid grid-cols-2 gap-4'>
          <TextField
            name='auditId'
            label='Audit ID'
            value={filters.auditId}
            onChange={handleChange}
            fullWidth
            size='small'
          />
          <TextField
            name='entityName'
            label='Entity Name'
            value={filters.entityName}
            onChange={handleChange}
            fullWidth
            size='small'
          />
          <TextField
            name='entityId'
            label='Entity ID'
            value={filters.entityId}
            onChange={handleChange}
            fullWidth
            size='small'
          />
          <TextField
            name='deviceIp'
            label='Device IP'
            value={filters.deviceIp}
            onChange={handleChange}
            fullWidth
            size='small'
          />
          <FormControl fullWidth size='small'>
            <InputLabel>Action</InputLabel>
            <Select
              name='action'
              value={filters.action}
              onChange={handleChange}
              label='Action'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='CREATED'>Create</MenuItem>
              <MenuItem value='UPDATED'>Update</MenuItem>
              <MenuItem value='DELETED'>Delete</MenuItem>
              <MenuItem value='APPROVED'>Approve</MenuItem>
              <MenuItem value='REJECTED'>Reject</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name='performedBy'
            label='Performed By'
            value={filters.performedBy}
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
          <FormControl fullWidth size='small'>
            <InputLabel>Sort By</InputLabel>
            <Select
              name='sortBy'
              value={filters.sortBy}
              onChange={handleChange}
              label='Sort By'
            >
              <MenuItem value=''>None</MenuItem>
              <MenuItem value='timestamp'>Timestamp</MenuItem>
              <MenuItem value='entityId'>Entity ID</MenuItem>
              <MenuItem value='action'>Action</MenuItem>
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

export default AuditLogFilterDialog;
