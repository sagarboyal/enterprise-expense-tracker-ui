import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ExpenseCard = ({ expense, onEdit, onDelete, onView }) => {
  const { id, title, amount, expenseDate, category, status } = expense;

  return (
    <div className='relative max-w-sm w-full bg-white border border-gray-300 shadow-md rounded-lg p-6 flex flex-col justify-between'>
      {/* Top-right Action Buttons */}
      <div className='absolute top-4 right-4 flex space-x-2'>
        <button
          onClick={() => onEdit(expense)}
          className='text-gray-700 hover:text-gray-500'
          title='Edit'
          aria-label='Edit expense'
        >
          <EditIcon fontSize='small' />
        </button>
        <button
          onClick={() => onDelete(id)}
          className='text-gray-700 hover:text-gray-500'
          title='Delete'
          aria-label='Delete expense'
        >
          <DeleteIcon fontSize='small' />
        </button>
      </div>

      {/* Expense Content */}
      <div>
        <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
        <p className='text-gray-500 text-sm mb-1'>Category: {category}</p>

        <div className='mt-3 flex justify-between items-center'>
          <p className='text-lg font-bold text-gray-900'>
            ₹{amount.toFixed(2)}
          </p>
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
          Date:{" "}
          {new Date(expenseDate).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Bottom-right View Button */}
      <div className='flex justify-end'>
        <button
          onClick={() => onView?.(expense)}
          className='text-black hover:text-gray-600 flex items-center text-sm font-medium'
          title='View Details'
        >
          <VisibilityIcon fontSize='small' className='mr-1' />
          View
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
