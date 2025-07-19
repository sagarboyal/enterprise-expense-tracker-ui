import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

const AdvancedFilterDialog = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onSearch,
  categories = [],
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleChange = (field) => (e) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onSearch(localFilters);
    onClose();
  };

  const resetLocalFilters = () => {
    setLocalFilters({
      title: filters.title, // Keep the main search title
      categoryName: null,
      status: null,
      startDate: null,
      endDate: null,
      minAmount: null,
      maxAmount: null,
    });
  };

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
          <div className='flex min-h-screen items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all font-[Poppins]'>
                <Dialog.Title className='text-xl font-bold text-gray-900 mb-4'>
                  Advanced Filters
                </Dialog.Title>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6'>
                  {/* Category */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Category
                    </label>
                    <select
                      className='w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2'
                      value={localFilters.categoryName || ""}
                      onChange={handleChange("categoryName")}
                    >
                      <option value=''>All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Status
                    </label>
                    <select
                      className='w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2'
                      value={localFilters.status || ""}
                      onChange={handleChange("status")}
                    >
                      <option value=''>All Statuses</option>
                      <option value='PENDING'>Pending</option>
                      <option value='APPROVED'>Approved</option>
                      <option value='REJECTED'>Rejected</option>
                    </select>
                  </div>

                  {/* Min Amount */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Min Amount
                    </label>
                    <input
                      type='number'
                      placeholder='e.g., 100'
                      className='w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2'
                      value={localFilters.minAmount || ""}
                      onChange={handleChange("minAmount")}
                    />
                  </div>

                  {/* Max Amount */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Max Amount
                    </label>
                    <input
                      type='number'
                      placeholder='e.g., 5000'
                      className='w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2'
                      value={localFilters.maxAmount || ""}
                      onChange={handleChange("maxAmount")}
                    />
                  </div>

                  {/* Start Date */}
                  <div className='sm:col-span-1'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Start Date
                    </label>
                    <input
                      type='date'
                      className='w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2'
                      value={localFilters.startDate || ""}
                      onChange={handleChange("startDate")}
                    />
                  </div>

                  {/* End Date */}
                  <div className='sm:col-span-1'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      End Date
                    </label>
                    <input
                      type='date'
                      className='w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2'
                      value={localFilters.endDate || ""}
                      onChange={handleChange("endDate")}
                    />
                  </div>
                </div>

                <div className='mt-8 flex justify-between items-center'>
                  <button
                    onClick={resetLocalFilters}
                    className='text-sm font-medium text-gray-600 hover:text-indigo-600'
                  >
                    Reset Filters
                  </button>
                  <div className='flex gap-2'>
                    <button
                      onClick={onClose}
                      className='px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyFilters}
                      className='px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AdvancedFilterDialog;
