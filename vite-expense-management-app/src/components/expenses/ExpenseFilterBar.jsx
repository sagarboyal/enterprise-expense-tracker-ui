const ExpenseFilterBar = ({
  onSearch,
  onToggleAdvanced,
  filters,
  setFilters,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  return (
    <div className='font-[Poppins] w-full mb-4'>
      <div className='flex justify-between items-center flex-wrap gap-4'>
        {/* 🔍 Search Section */}
        <div className='flex items-center gap-2 flex-grow'>
          <label htmlFor='search-title' className='sr-only'>
            Search by description
          </label>
          <input
            id='search-title'
            type='text'
            name='title'
            value={filters.title || ""}
            onChange={handleChange}
            placeholder='Search by title...'
            className='w-full max-w-xs px-3 py-2 border rounded-md text-sm'
            autoComplete='off'
          />
          <button
            type='button'
            onClick={onSearch}
            className='px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1'
          >
            Search
          </button>
        </div>

        <div className='flex-shrink-0'>
          <button
            onClick={onToggleAdvanced}
            className='px-4 py-2 bg-gray-100 border border-gray-300 text-sm rounded-md hover:bg-gray-200'
          >
            Advanced Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilterBar;
