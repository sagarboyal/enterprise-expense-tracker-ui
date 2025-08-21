import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

const ViewRequestModal = ({ isOpen, onClose, request }) => {
    if (!request) return null;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            {/* Increased z-index to ensure it's on top */}
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    {/* Added top padding (pt-20) to the container to avoid collision with navbar */}
                    <div className="flex min-h-full items-center justify-center p-4 pt-20 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                                    Contact Request Details
                                </Dialog.Title>
                                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                                
                                <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                                        <p className="mt-1 text-md text-gray-900">{request.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="mt-1 text-md text-gray-900">{request.email}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-sm font-medium text-gray-500">Date Received</p>
                                        <p className="mt-1 text-md text-gray-900">{formatDate(request.timestamp)}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-sm font-medium text-gray-500">Message</p>
                                        <div className="mt-2 max-h-60 overflow-y-auto rounded-lg bg-gray-50 p-4 border border-gray-200">
                                            <p className="text-md text-gray-800 whitespace-pre-wrap">{request.message}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors" onClick={onClose}>
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}; 

export default ViewRequestModal;