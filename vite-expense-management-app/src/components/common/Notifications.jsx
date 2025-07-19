import React, { useState, useEffect, useCallback } from "react";
import {
  BellIcon,
  CheckCircleIcon,
  InboxIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";

// --- Helper Components & Functions ---

const formatRelativeTime = (isoDate) => {
  const now = new Date();
  const date = new Date(isoDate);
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const Spinner = () => (
  <div className='flex justify-center items-center py-20'>
    <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600'></div>
  </div>
);

const EmptyState = () => (
  <div className='text-center py-20 px-4'>
    <InboxIcon className='mx-auto h-16 w-16 text-gray-300' />
    <h3 className='mt-4 text-xl font-semibold text-gray-800'>All Clear!</h3>
    <p className='mt-2 text-gray-500'>You have no notifications here.</p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className='text-center py-20 px-4 bg-red-50 rounded-lg'>
    <ExclamationTriangleIcon className='mx-auto h-16 w-16 text-red-400' />
    <h3 className='mt-4 text-xl font-semibold text-red-800'>
      An Error Occurred
    </h3>
    <p className='mt-2 text-red-600'>{message}</p>
  </div>
);

// --- Main Notifications Page Component ---

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    totalPages: 1,
    last: true,
  });
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'unread'
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(
    async (page = 0) => {
      setLoading(true);
      setError(null);
      try {
        const status = activeTab === "unread" ? false : null;
        let url = `/api/notification?pageNumber=${page}&pageSize=10&sortOrder=desc`;
        if (status !== null) {
          url += `&status=${status}`;
        }

        const response = await api.get(url);

        const data = response.data;
        console.log("Fetched notifications:", data);

        setNotifications(data.content);
        setPagination({
          pageNumber: data.pageNumber,
          totalPages: data.totalPages,
          // FIX: Changed `data.last` to `data.lastPage` to match backend response
          last: data.lastPage,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch notifications.");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    },
    [activeTab]
  );

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get("/api/notification/unread-count");
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(0);
  }, [fetchNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);
    fetchUnreadCount();
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchNotifications(newPage);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/api/notification/status/${id}`);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notification/${id}`);
      fetchNotifications(pagination.pageNumber);
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("/api/notification/mark-all-read");
      fetchNotifications(0);
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const TABS = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: unreadCount },
  ];

  return (
    <div className='bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='max-w-4xl mx-auto'>
        <header className='mb-6'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
            Notifications
          </h1>
          <p className='mt-1 text-sm text-gray-600'>
            Manage your account notifications and stay up-to-date.
          </p>
        </header>

        <div className='bg-white rounded-lg shadow-md border border-gray-200'>
          <div className='flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 px-4 py-2'>
            <div className='flex items-center border-b sm:border-b-0'>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className='bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full'>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <div className='mt-2 sm:mt-0'>
                <button
                  onClick={handleMarkAllRead}
                  className='text-xs font-semibold text-indigo-600 hover:text-indigo-800'
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          <div>
            {error ? (
              <ErrorState message={error} />
            ) : loading ? (
              <Spinner />
            ) : notifications.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className='divide-y divide-gray-200'>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className='flex items-start gap-4 p-4 transition-colors duration-200 hover:bg-gray-50'
                  >
                    {!n.read && (
                      <div className='mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-indigo-500'></div>
                    )}
                    <div
                      className={`flex-shrink-0 ${n.read ? "ml-[14px]" : ""}`}
                    >
                      <BellIcon className='h-6 w-6 text-gray-400' />
                    </div>
                    <div className='flex-grow'>
                      <p className='text-sm text-gray-700'>{n.message}</p>
                      <p className='mt-1 text-xs text-gray-500'>
                        {/* FIX: Changed `n.createdAt` to `n.sentAt` to match backend response */}
                        {formatRelativeTime(n.sentAt)}
                      </p>
                    </div>
                    <div className='flex flex-shrink-0 items-center gap-4'>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className='text-xs font-semibold text-indigo-600 hover:text-indigo-800'
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n.id)}
                        title='Delete Notification'
                        className='text-gray-400 hover:text-red-600'
                      >
                        <TrashIcon className='h-5 w-5' />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!loading && !error && notifications.length > 0 && (
            <div className='flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3'>
              <button
                onClick={() => handlePageChange(pagination.pageNumber - 1)}
                disabled={pagination.pageNumber === 0}
                className='px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Previous
              </button>
              <p className='text-sm text-gray-600'>
                Page{" "}
                <span className='font-medium'>{pagination.pageNumber + 1}</span>{" "}
                of <span className='font-medium'>{pagination.totalPages}</span>
              </p>
              <button
                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                disabled={pagination.last}
                className='px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
