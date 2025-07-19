import { useState, useEffect } from "react";
import {
  BellIcon,
  XMarkIcon,
  EnvelopeOpenIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const NotificationDropdown = ({ isOpen, setIsOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    return api.get(`/api/notification?sortOrder=desc`);
  };

  const loadNotifications = async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const res = await fetchNotifications();
      if (res.data.error) {
        throw new Error(res.data.error);
      }
      setNotifications(res.data.content || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/api/notification/unread-count");
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [isOpen]);

  useEffect(() => {
    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async (id) => {
    const originalNotifications = [...notifications];
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await api.delete(`/api/notification/${id}`);
      fetchUnreadCount();
    } catch (error) {
      console.error("Failed to delete notification:", error);
      setNotifications(originalNotifications);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await api.put("/api/notification/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative'>
      <button
        onClick={setIsOpen}
        className='relative p-2 rounded-full hover:bg-gray-100'
      >
        <BellIcon className='h-6 w-6 text-gray-600' />
        {unreadCount > 0 && (
          <span className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-gray-200 px-4 py-3'>
            <h3 className='text-lg font-semibold text-gray-800'>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Body */}
          <div className='max-h-80 overflow-y-auto'>
            {loading ? (
              <div className='flex justify-center items-center py-10'>
                <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-500'></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className='py-10 text-center'>
                <CheckCircleIcon className='mx-auto h-12 w-12 text-gray-300' />
                <h4 className='mt-2 text-sm font-semibold text-gray-700'>
                  All caught up!
                </h4>
                <p className='text-xs text-gray-500'>
                  You have no new notifications.
                </p>
              </div>
            ) : (
              <ul className='divide-y divide-gray-100'>
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 ${
                      !notif.read ? "bg-indigo-50/50" : "bg-white"
                    }`}
                  >
                    {!notif.read && (
                      <div className='mt-1 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0'></div>
                    )}
                    <div className={`flex-1 ${notif.read && "pl-5"}`}>
                      <p className='text-sm text-gray-800'>{notif.message}</p>
                      <p className='mt-1 text-xs text-gray-500'>
                        {formatRelativeTime(notif.sentAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className='text-gray-400 hover:text-red-500 flex-shrink-0'
                      title='Delete notification'
                    >
                      <XMarkIcon className='h-4 w-4' />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className='border-t border-gray-200 bg-gray-50/80 px-4 py-2'>
            <a
              href='/homepage/notifications'
              className='flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500'
            >
              <EnvelopeOpenIcon className='h-5 w-5' />
              <span>View all notifications</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
