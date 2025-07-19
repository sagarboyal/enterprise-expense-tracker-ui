import { useState } from "react";
import ExpenseCard from "./ExpenseCard";
import UpdateExpenseDialog from "./UpdateExpenseDialog";
import toast from "react-hot-toast";
import api from "../../services/api";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ExpenseList = ({
  expenses,
  onDeleteSuccess,
  page,
  totalPages,
  onPageChange,
  openModal,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openUpdateExpenseModal, setOpenUpdateExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleDeleteExpense = async (id) => {
    const toastId = toast.loading("Deleting expense...");
    setLoadingDelete(true);
    try {
      await api.delete(`/api/expenses/${id}`);
      toast.success("Expense deleted successfully.", { id: toastId });
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense.", { id: toastId });
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setOpenUpdateExpenseModal(true);
  };

  const handleUpdateSuccess = () => {
    setOpenUpdateExpenseModal(false);
    setSelectedExpense(null);
    if (onDeleteSuccess) {
      onDeleteSuccess();
    }
  };

  return (
    <>
      {selectedExpense && (
        <UpdateExpenseDialog
          isOpen={openUpdateExpenseModal}
          onClose={() => setOpenUpdateExpenseModal(false)}
          expense={selectedExpense}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      <div className='space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {expenses.map((expense) => (
            <div key={expense.id} className='flex justify-center'>
              <ExpenseCard
                expense={expense}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
                onView={() => openModal(expense)}
              />
            </div>
          ))}
        </div>

        {/* Improved Pagination Controls */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between pt-4'>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
            >
              <ChevronLeftIcon className='h-4 w-4' />
              Previous
            </button>
            <span className='text-sm text-gray-600'>
              Page <span className='font-bold'>{page + 1}</span> of{" "}
              <span className='font-bold'>{totalPages}</span>
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
            >
              Next
              <ChevronRightIcon className='h-4 w-4' />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ExpenseList;
