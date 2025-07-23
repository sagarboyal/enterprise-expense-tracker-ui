import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Slide,
} from "@mui/material";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const UserViewDialog = ({ open, onClose, user }) => {
  if (!user) return null;

  return (
      <Dialog
          open={open}
          onClose={onClose}
          TransitionComponent={Transition}
          maxWidth='sm'
          fullWidth
          PaperProps={{ className: "font-[Poppins] rounded-xl" }}
      >
        <DialogTitle className='text-xl font-semibold text-indigo-700'>
          User Details
        </DialogTitle>
        <Divider />
        <DialogContent className='space-y-3 py-4'>
          <Typography variant='body1'>
            <strong>Full Name:</strong> {user.fullName}
          </Typography>
          <Typography variant='body1'>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant='body1'>
            <strong>Role:</strong> {user.role}
          </Typography>
          <Typography variant='body1'>
            <strong>Total Expenses:</strong> ₹{user.totalExpenses}
          </Typography>
        </DialogContent>
        <DialogActions className='px-6 pb-4'>
          <Button
              onClick={onClose}
              variant='outlined'
              sx={{ fontFamily: "Poppins", textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default UserViewDialog;
