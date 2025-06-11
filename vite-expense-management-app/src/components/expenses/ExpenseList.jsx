import { useState } from "react";
import ExpenseCard from "./ExpenseCard";
import toast from "react-hot-toast";
import api from "../../services/api";
import UpdateExpenseDialog from "./UpdateExpenseDialog";

const ExpenseList = ({
  expenses,
  loading,
  onDeleteSuccess,
  page,
  totalPages,
  onPageChange,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openUpdateExpenseModal, setOpenUpdateExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleDeleteExpense = async (id) => {
    try {
      setLoadingDelete(true);
      await api.delete(`/api/expenses/${id}`);
      toast.success("Expense deleted successfully.");
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setOpenUpdateExpenseModal(true);
  };

  return (
    <>
      {selectedExpense && openUpdateExpenseModal && (
        <UpdateExpenseDialog
          isOpen={openUpdateExpenseModal}
          onClose={() => {
            setOpenUpdateExpenseModal(false);
            setSelectedExpense(null);
            onDeleteSuccess?.();
          }}
          expense={selectedExpense}
        />
      )}

      {loading ? (
        <div className='text-center py-10 text-gray-600 font-medium text-lg'>
          Loading expenses...
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4'>
            {expenses.map((expense) => (
              <div key={expense.id} className='flex justify-center'>
                <ExpenseCard
                  expense={expense}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className='mt-8 flex justify-center gap-4'>
            <button
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
              className='px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50'
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(page + 1)}
              className='px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ExpenseList;
