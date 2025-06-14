const ActionHeader = ({
  title,
  onAdd,
  onFilterChange,
  onFilterSubmit,
  filters = [],
  children,
}) => {
  return (
    <div className='flex flex-wrap justify-between items-center gap-4 mb-6'>
      <h2 className='text-xl font-bold'>{title}</h2>

      <div className='flex flex-wrap items-center gap-3'>
        {filters.map((filter) => (
          <div key={filter.name}>
            {filter.type === "select" ? (
              <select
                name={filter.name}
                value={filter.value}
                onChange={onFilterChange}
                className='px-3 py-1.5 border rounded text-sm'
              >
                {filter.options.map((option) => (
                  <option key={option.key ?? option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={filter.type}
                name={filter.name}
                value={filter.value}
                onChange={onFilterChange}
                placeholder={filter.placeholder}
                className='px-3 py-1.5 border rounded text-sm'
              />
            )}
          </div>
        ))}

        {onFilterSubmit && (
          <button
            onClick={onFilterSubmit}
            className='px-4 py-1.5 bg-black text-white rounded hover:bg-gray-500 text-sm duration-300'
          >
            Apply
          </button>
        )}

        {onAdd && (
          <button
            onClick={onAdd}
            className='px-4 py-1.5 bg-black text-white rounded hover:bg-gray-800 text-sm'
          >
            + Add
          </button>
        )}
      </div>

      {children && <div>{children}</div>}
    </div>
  );
};

export default ActionHeader;
