import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const LogoutDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Confirm Logout
                </Dialog.Title>
                <div className='mt-2 text-sm text-gray-600'>
                  Are you sure you want to logout?
                </div>

                <div className='mt-4 flex justify-end gap-3'>
                  <button
                    className='px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200'
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className='px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-600 transition duration-300 ease-in-out'
                    onClick={onConfirm}
                  >
                    Logout
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

export default LogoutDialog;
