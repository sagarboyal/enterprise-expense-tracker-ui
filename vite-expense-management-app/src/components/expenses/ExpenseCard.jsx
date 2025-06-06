import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const { id, title, amount, expenseDate, category, status, message } = expense;

  return (
    <div className='relative max-w-sm w-full bg-white border border-gray-300 shadow-md rounded-lg p-6'>
      {/* Action buttons (top-right) */}
      <div className='absolute top-6 right-5 flex space-x-2'>
        <button
          onClick={() => onEdit(expense)}
          className='text-black-600 hover:text-gray-500'
          title='Edit'
        >
          <EditIcon fontSize='small' />
        </button>
        <button
          onClick={() => onDelete(id)}
          className='text-black-600 hover:text-gray-500'
          title='Delete'
        >
          <DeleteIcon fontSize='small' />
        </button>
      </div>

      {/* Expense details */}
      <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
      <p className='text-gray-500 text-sm'>Category: {category}</p>

      <div className='mt-4 flex justify-between items-center'>
        <p className='text-lg font-bold text-gray-900'>₹{amount.toFixed(2)}</p>
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
      {message && (
        <p className='text-sm text-gray-500 mt-2 truncate'>{message}</p>
      )}
    </div>
  );
};

export default ExpenseCard;
