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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        {/* Backdrop */}
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

        {/* Dialog Container */}
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
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all font-[Poppins]'>
                <Dialog.Title className='text-lg font-medium text-gray-900 mb-4'>
                  Advanced Filters
                </Dialog.Title>

                {/* Form Fields */}
                <div className='space-y-3 text-sm'>
                  {/* Category Dropdown */}
                  <select
                    className='w-full border p-2 rounded'
                    value={localFilters.categoryName || ""}
                    onChange={handleChange("categoryName")}
                  >
                    <option value=''>All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name.charAt(0).toUpperCase() +
                          cat.name.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>

                  <input
                    type='number'
                    placeholder='Min Amount'
                    className='w-full border p-2 rounded'
                    value={localFilters.minAmount || ""}
                    onChange={handleChange("minAmount")}
                  />
                  <input
                    type='number'
                    placeholder='Max Amount'
                    className='w-full border p-2 rounded'
                    value={localFilters.maxAmount || ""}
                    onChange={handleChange("maxAmount")}
                  />
                  <input
                    type='date'
                    className='w-full border p-2 rounded'
                    value={localFilters.startDate || ""}
                    onChange={handleChange("startDate")}
                  />
                  <input
                    type='date'
                    className='w-full border p-2 rounded'
                    value={localFilters.endDate || ""}
                    onChange={handleChange("endDate")}
                  />
                </div>

                {/* Action Buttons */}
                <div className='mt-6 flex justify-end gap-2'>
                  <button
                    onClick={onClose}
                    className='text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className='text-sm px-4 py-2 rounded bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition'
                  >
                    Apply Filters
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

export default AdvancedFilterDialog;
