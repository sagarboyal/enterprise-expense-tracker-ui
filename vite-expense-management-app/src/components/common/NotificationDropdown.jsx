import { useState, useEffect, use } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../services/api";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = (status = null, page = 0, size = 5) => {
    const params = new URLSearchParams({
      pageNumber: page,
      pageSize: size,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    params.append("status", status !== null ? status : "false");
    return api.get(`/api/notification`);
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications(false, 0, 5);
      console.log("Fetched notifications:", res.data);
      if (res.data.error) {
        throw new Error(res.data.error);
      }
      setNotifications(res.data.content || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadNotifications();
  }, [open]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/api/notification/unread-count");
      console.log("Fetched unread count:", res.data.unreadCount);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notification/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchUnreadCount();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/api/notification/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <div className='relative'>
      <button onClick={() => setOpen(!open)} className='relative'>
        <NotificationsNoneIcon className='text-gray-700 hover:text-black' />
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5'>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4'>
          <h3 className='font-semibold text-sm mb-2 text-gray-700'>
            Notifications
          </h3>
          {loading ? (
            <div className='text-center py-2'>
              <CircularProgress size={20} />
            </div>
          ) : notifications.length === 0 ? (
            <p className='text-sm text-gray-500'>No new notifications</p>
          ) : (
            <>
              <ul className='space-y-2 max-h-60 overflow-y-auto'>
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`flex items-start justify-between text-sm border-b pb-2 px-3 py-2 rounded transition
        ${!notif.read ? "bg-gray-100 font-medium" : "bg-white text-gray-700"}`}
                  >
                    <span className='pr-2 break-words'>{notif.message}</span>

                    {notif.read && (
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className='text-gray-400 hover:text-red-500 ml-2'
                        title='Delete notification'
                      >
                        <DeleteOutlineIcon fontSize='small' />
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {notifications.length > 0 && (
                <div className='flex justify-end'>
                  <button
                    onClick={markAllAsRead}
                    className='text-sm text-black hover:underline pt-2'
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
