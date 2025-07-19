import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const getStatusStyles = (status) => {
  switch (status) {
    case "APPROVED":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: <CheckCircleIcon className='h-4 w-4' />,
      };
    case "PENDING":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: <ClockIcon className='h-4 w-4' />,
      };
    case "REJECTED":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <XCircleIcon className='h-4 w-4' />,
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: null,
      };
  }
};

const ExpenseCard = ({ expense, onEdit, onDelete, onView }) => {
  const { id, title, amount, expenseDate, category, status } = expense;
  const statusStyles = getStatusStyles(status);

  return (
    <div className='relative w-full max-w-sm bg-white border border-gray-200/80 shadow-lg rounded-xl flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
      {/* Main Content */}
      <div className='p-5'>
        <div className='flex justify-between items-start gap-4 mb-2'>
          <h2 className='flex-1 text-xl font-bold text-gray-800 break-words min-w-0'>
            {title}
          </h2>
          <div
            className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles.bg} ${statusStyles.text}`}
          >
            {statusStyles.icon}
            {status}
          </div>
        </div>
        <div className='flex items-center text-sm text-gray-500 mb-4'>
          <TagIcon className='h-4 w-4 mr-1.5' />
          <span>{category.name}</span>
        </div>

        <div className='flex justify-between items-baseline'>
          <p className='text-3xl font-extrabold text-gray-900'>
            ₹{amount.toLocaleString("en-IN")}
          </p>
          <p className='text-sm text-gray-500'>
            {new Date(expenseDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className='bg-gray-50/70 border-t border-gray-200/80 px-5 py-3 flex justify-between items-center'>
        <button
          onClick={() => onView(expense)}
          className='inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors'
          title='View Details'
        >
          <EyeIcon className='h-5 w-5' />
          View
        </button>
        <div className='flex space-x-3'>
          <button
            onClick={() => onEdit(expense)}
            className='text-gray-500 hover:text-blue-600 transition-colors'
            title='Edit Expense'
          >
            <PencilIcon className='h-5 w-5' />
          </button>
          <button
            onClick={() => onDelete(id)}
            className='text-gray-500 hover:text-red-600 transition-colors'
            title='Delete Expense'
          >
            <TrashIcon className='h-5 w-5' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
