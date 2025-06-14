import { useState } from "react";

const ExpenseFilterBar = ({
  onSearch,
  onToggleAdvanced,
  filters,
  setFilters,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  console.log("filters: ", filters);
  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
    onToggleAdvanced?.();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleReset = () => {
    setFilters({
      title: "",
      categoryName: "",
      status: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
      pageNumber: "",
      pageSize: "",
      sortBy: "",
      sortOrder: "asc",
    });
    onReset?.();
  };

  return (
    <div className='w-full mb-4'>
      <div className='flex justify-between items-center flex-wrap gap-4'>
        {/* Search Section */}
        <div className='flex items-center gap-2 flex-grow'>
          <input
            type='text'
            name='title'
            value={filters.title || ""}
            onChange={handleChange}
            placeholder='Search by description...'
            className='px-3 py-2 border rounded-md text-sm w-full max-w-xs'
          />
          <button
            onClick={onSearch}
            className='px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800'
          >
            Search
          </button>
        </div>

        {/* Advanced Filter Button */}
        <div className='flex-shrink-0'>
          <button
            onClick={toggleAdvanced}
            className='px-4 py-2 bg-gray-100 border border-gray-300 text-sm rounded-md hover:bg-gray-200'
          >
            Advanced Filter
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className='mt-4 p-4 border rounded-md bg-gray-50'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <input
              type='text'
              name='categoryName'
              value={filters.categoryName || ""}
              onChange={handleChange}
              placeholder='Category Name'
              className='p-2 border rounded text-sm'
            />
            <select
              name='status'
              value={filters.status || ""}
              onChange={handleChange}
              className='p-2 border rounded text-sm'
            >
              <option value=''>All Status</option>
              <option value='pending'>Pending</option>
              <option value='approved'>Approved</option>
              <option value='rejected'>Rejected</option>
            </select>
            <input
              type='date'
              name='startDate'
              value={filters.startDate || ""}
              onChange={handleChange}
              className='p-2 border rounded text-sm'
            />
            <input
              type='date'
              name='endDate'
              value={filters.endDate || ""}
              onChange={handleChange}
              className='p-2 border rounded text-sm'
            />
            <input
              type='number'
              name='minAmount'
              value={filters.minAmount || ""}
              onChange={handleChange}
              placeholder='Min Amount'
              className='p-2 border rounded text-sm'
            />
            <input
              type='number'
              name='maxAmount'
              value={filters.maxAmount || ""}
              onChange={handleChange}
              placeholder='Max Amount'
              className='p-2 border rounded text-sm'
            />
            <input
              type='number'
              name='pageNumber'
              value={filters.pageNumber || ""}
              onChange={handleChange}
              placeholder='Page Number'
              className='p-2 border rounded text-sm'
            />
            <input
              type='number'
              name='pageSize'
              value={filters.pageSize || ""}
              onChange={handleChange}
              placeholder='Page Size'
              className='p-2 border rounded text-sm'
            />
            <input
              type='text'
              name='sortBy'
              value={filters.sortBy || ""}
              onChange={handleChange}
              placeholder='Sort By'
              className='p-2 border rounded text-sm'
            />
            <select
              name='sortOrder'
              value={filters.sortOrder || "asc"}
              onChange={handleChange}
              className='p-2 border rounded text-sm'
            >
              <option value='asc'>Ascending</option>
              <option value='desc'>Descending</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className='mt-4 flex justify-end gap-2'>
            <button
              onClick={handleReset}
              className='px-4 py-2 border border-gray-400 text-sm rounded-md bg-white hover:bg-gray-100'
            >
              Reset
            </button>
            <button
              onClick={onSearch}
              className='px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800'
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseFilterBar;
