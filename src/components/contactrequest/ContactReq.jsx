import { useState, useEffect, useCallback } from 'react';
import { 
    MagnifyingGlassIcon, 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    ArrowPathIcon, 
    InboxIcon, 
    EyeIcon, 
    TrashIcon,
} from '@heroicons/react/24/outline';

import api from "../../services/api";
import ViewRequestModal from './ViewRequestModal';

const ContactReq = () => {
    const [loading, setLoading] = useState(true);
    const [contactRequests, setContactRequests] = useState([]);
    const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10, totalPages: 0, totalElements: 0, lastPage: true });
    const [filters, setFilters] = useState({ email: '', sortBy: 'timestamp', sortOrder: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);

    const fetchContactRequests = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ pageNumber: pagination.pageNumber, pageSize: pagination.pageSize, sortBy: filters.sortBy, sortOrder: filters.sortOrder });
            if (filters.email) params.append('email', filters.email);
            const response = await api.get(`/api/contact?${params.toString()}`);
            setContactRequests(response.data.content || []);
            setPagination({ pageNumber: response.data.pageNumber, pageSize: response.data.pageSize, totalPages: response.data.totalPages, totalElements: response.data.totalElements, lastPage: response.data.lastPage });
        } catch (error) {
            console.error("Error fetching contact requests:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageNumber, pagination.pageSize, filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prevFilters => ({ ...prevFilters, email: searchTerm }));
            setPagination(prev => ({...prev, pageNumber: 0}));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchContactRequests();
    }, [fetchContactRequests]);

    const handlePageChange = (newPageNumber) => {
        if (newPageNumber >= 0 && newPageNumber < pagination.totalPages) {
            setPagination(prev => ({ ...prev, pageNumber: newPageNumber }));
        }
    };

    const handleViewClick = (request) => {
        setSelectedRequest(request);
        setViewModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await api.delete(`/api/contact/${id}`);
                fetchContactRequests();
            } catch (error) {
                console.error("Error deleting contact request:", error);
            }
        }
    };
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const truncateMessage = (message, length = 15) => {
        if (message.length <= length) {
            return message;
        }
        return message.substring(0, length) + '...';
    };
    return (
        <>
            <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
                <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Contact Requests</h1>
                        <p className="text-md text-gray-600 mt-1">Manage and respond to inquiries from your users.</p>
                    </header>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Received</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-16">
                                                <div className="flex justify-center items-center">
                                                    <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
                                                    <span className="ml-3 text-lg text-gray-600">Loading requests...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : contactRequests.length > 0 ? (
                                        contactRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{request.fullName}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{request.email}</div></td>
                                                 <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-600" title={request.message}>
                                                        {truncateMessage(request.message)}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(request.timestamp)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-4">
                                                        <button onClick={() => handleViewClick(request)} className="text-indigo-600 hover:text-indigo-900" title="View Details">
                                                            <EyeIcon className="h-5 w-5" />
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(request.id)} className="text-red-600 hover:text-red-900" title="Delete Request">
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-16">
                                                <div className="text-gray-500 flex flex-col items-center">
                                                    <InboxIcon className="h-12 w-12 text-gray-400 mb-2" />
                                                    <h3 className="text-lg font-medium">No requests found</h3>
                                                    <p className="mt-1">Try adjusting your search terms.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {!loading && pagination.totalPages > 0 && (
                             <div className="p-4 sm:p-6 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
                                <div className="text-sm text-gray-700">
                                    Page <span className="font-medium">{pagination.pageNumber + 1}</span> of <span className="font-medium">{pagination.totalPages}</span>
                                    <span className="hidden sm:inline"> | Total: <span className="font-medium">{pagination.totalElements}</span> requests</span>
                                </div>
                                <nav className="flex items-center space-x-2">
                                    <button onClick={() => handlePageChange(pagination.pageNumber - 1)} disabled={pagination.pageNumber === 0} className="p-2 rounded-md inline-flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handlePageChange(pagination.pageNumber + 1)} disabled={pagination.lastPage} className="p-2 rounded-md inline-flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        <span className="sr-only">Next</span>
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ViewRequestModal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} request={selectedRequest} />
        </>
    );
};


export default ContactReq;
