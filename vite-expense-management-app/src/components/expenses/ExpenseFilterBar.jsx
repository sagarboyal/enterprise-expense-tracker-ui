import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

const ExpenseFilterBar = ({
  onSearch,
  onToggleAdvanced,
  filters,
  setFilters,
  onReset,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className='p-4 bg-white rounded-xl shadow-sm border border-gray-200/80'>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 items-center'>
        {/* Search Input */}
        <div className='relative md:col-span-2'>
          <MagnifyingGlassIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
          <input
            type='text'
            name='title'
            value={filters.title || ""}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder='Search by title...'
            className='w-full border-gray-300 rounded-lg shadow-sm pl-10 focus:ring-indigo-500 focus:border-indigo-500 py-2.5'
            autoComplete='off'
          />
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-2 md:col-span-3 justify-end'>
          <button
            onClick={onSearch}
            className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
          >
            <MagnifyingGlassIcon className='h-5 w-5' />
            Search
          </button>
          <button
            onClick={onToggleAdvanced}
            className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
          >
            <AdjustmentsHorizontalIcon className='h-5 w-5' />
            Advanced
          </button>
          <button
            onClick={onReset}
            className='inline-flex items-center justify-center px-4 py-2.5 bg-white text-gray-700 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilterBar;
