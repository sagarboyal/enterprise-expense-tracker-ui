const ExpenseCard = ({ expense }) => {
  const { title, amount, expenseDate, category, status, message } = expense;

  return (
    <div className='max-w-sm w-full bg-white border border-gray-300 shadow-md rounded-lg p-6'>
      <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
      <p className='text-gray-500 text-sm'>Category: {category}</p>

      <div className='mt-4 flex justify-between'>
        <p className='text-lg font-bold text-gray-900'>${amount.toFixed(2)}</p>
        <p
          className={`text-sm font-medium ${
            status === "APPROVED"
              ? "text-green-600"
              : status === "PENDING"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {status}
        </p>
      </div>

      <p className='text-sm text-gray-400 mt-2'>
        Date: {new Date(expenseDate).toLocaleDateString()}
      </p>
      <p className='text-sm text-gray-500 mt-2'>{message}</p>
    </div>
  );
};

export default ExpenseCard;
