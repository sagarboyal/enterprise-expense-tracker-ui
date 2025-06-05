import { useState } from "react";
import ExpenseCard from "./expenses/ExpenseCard";
import ExpenseViewModal from "./expenses/ExpenseViewModal";
import CreateExpenseDialog from "./expenses/CreateExpenseDialog";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useMyContext } from "../store/ContextApi";

const HomePage = () => {
  const dummyExpense = [
    {
      title: "Sample Expense",
      amount: 150.75,
      expenseDate: "2023-10-01",
      category: "Travel",
      status: "APPROVED",
      message: "Approved for reimbursement",
    },
    {
      title: "Sample Expense 2",
      amount: 150.75,
      expenseDate: "2023-10-01",
      category: "Travel",
      status: "PENDING",
      message: "Approved for reimbursement",
    },
    {
      title: "Sample Expense 3",
      amount: 150.75,
      expenseDate: "2023-10-01",
      category: "Travel",
      status: "REJECTED",
      message: "Approved for reimbursement",
    },
  ];
  const { token, setToken } = useMyContext();

  const [openViewExpenseModal, setOpenViewExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openCreateExpenseModal, setOpenCreateExpenseModal] = useState(false);
  // Function to handle opening the modal with selected expense
  const openModal = (expense) => {
    setSelectedExpense(expense);
    setOpenViewExpenseModal(true);
  };

  const handleAddExpense = (data) => {
    console.log("Expense added:", data);
    // Save to backend or state
  };

  const handleSuccessfulExpenseCreation = (expense) => {
    console.log("Expense created successfully:", expense);
  };

  return (
    <>
      {/* Expense View Modal */}
      {selectedExpense && (
        <ExpenseViewModal
          open={openViewExpenseModal}
          setOpen={setOpenViewExpenseModal}
          expense={selectedExpense}
        />
      )}
      <div className='min-h-screen flex items-center justify-center flex-col bg-gray-100'>
        <div className='p-6'>
          <button
            onClick={() => setOpenCreateExpenseModal(true)}
            className='px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition duration-300 flex items-center gap-2'
          >
            <EditNoteIcon className='text-xl' />
            Add Expense
          </button>

          <CreateExpenseDialog
            isOpen={openCreateExpenseModal}
            onClose={() => setOpenCreateExpenseModal(false)}
            onSubmit={handleAddExpense}
          />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {dummyExpense.map((expense, index) => (
            <div key={index} className='flex justify-center'>
              <div onClick={() => openModal(expense)}>
                <ExpenseCard expense={expense} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default HomePage;
