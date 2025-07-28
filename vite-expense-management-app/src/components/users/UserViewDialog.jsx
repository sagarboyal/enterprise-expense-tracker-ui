import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slide,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { forwardRef } from "react";
import {
  MailOutline,
  AccountBalanceWalletOutlined,
  ContentCopy,
  Fingerprint,
} from "@mui/icons-material";
import toast from 'react-hot-toast';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserViewDialog = ({ open, onClose, user }) => {
  if (!user) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${fieldName} copied to clipboard!`);
    }).catch(err => {
      toast.error('Failed to copy!');
      console.error('Failed to copy text: ', err);
    });
  };

  const getRoleChip = (role) => {
    const roleKey = role || "User";
    const roleStyles = {
      Admin: { color: 'error', variant: 'filled' },
      Manager: { color: 'primary', variant: 'filled' },
      User: { color: 'info', variant: 'outlined' },
    };
    const style = roleStyles[roleKey] || roleStyles.User;
    return <Chip label={roleKey} color={style.color} variant={style.variant} size="small" sx={{ fontWeight: 600, letterSpacing: '0.5px' }} />;
  };

  return (
      <Dialog
          open={open}
          onClose={onClose}
          TransitionComponent={Transition}
          maxWidth="sm"
          fullWidth
          aria-labelledby="user-view-dialog-title"
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0px 20px 40px -10px rgba(0, 0, 0, 0.2)',
              background: 'linear-gradient(170deg, #f9f9f9 0%, #f4f6f8 100%)',
              fontFamily: "Poppins, sans-serif",
            },
          }}
      >
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "primary.light",
                  color: "primary.dark",
                  fontSize: "2.5rem",
                  margin: '0 auto',
                  mb: 1.5,
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Typography variant="h5" component="h2" id="user-view-dialog-title" sx={{ fontWeight: "bold" }}>
              {user.fullName}
            </Typography>
            {getRoleChip(user.role)}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <DetailItem
                icon={<Fingerprint />}
                label="User ID"
                value={user.id}
                onCopy={() => handleCopy(user.id, 'User ID')}
            />
            <DetailItem
                icon={<MailOutline />}
                label="Email Address"
                value={user.email}
                onCopy={() => handleCopy(user.email, 'Email')}
            />
            <DetailItem
                icon={<AccountBalanceWalletOutlined />}
                label="Total Expenses"
                value={formatCurrency(user.totalExpenses)}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pb: 3, justifyContent: 'center' }}>
          <Button
              onClick={onClose}
              variant="contained"
              sx={{
                fontFamily: "Poppins, sans-serif",
                textTransform: "none",
                borderRadius: 2,
                px: 4,
                py: 1,
                boxShadow: 'none',
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
  );
};

const DetailItem = ({ icon, label, value, onCopy }) => (
    <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 1.5,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: 3,
          border: '1px solid #e8eaf6'
        }}
    >
      <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.main', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        {icon}
      </Avatar>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary", wordBreak: 'break-all', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value}
        </Typography>
      </Box>
      {onCopy && (
          <Tooltip title="Copy">
            <IconButton onClick={onCopy} size="small" sx={{ ml: 1 }}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
      )}
    </Box>
);

export default UserViewDialog;
