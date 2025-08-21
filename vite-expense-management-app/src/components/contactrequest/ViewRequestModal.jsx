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
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    Contact Request Details
                                </Dialog.Title>
                                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                                        <p className="text-md text-gray-900">{request.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-md text-gray-900">{request.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Date Received</p>
                                        <p className="text-md text-gray-900">{formatDate(request.timestamp)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Message</p>
                                        <p className="text-md text-gray-900 whitespace-pre-wrap">{request.message}</p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2" onClick={onClose}>
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