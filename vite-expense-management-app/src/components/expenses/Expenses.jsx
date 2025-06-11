import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ExpenseViewModal from "./ExpenseViewModal";
import ExpenseList from "./ExpenseList";
import CreateExpenseDialog from "./CreateExpenseDialog";

const Expenses = () => {
  const [openViewExpenseModal, setOpenViewExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openCreateExpenseModal, setOpenCreateExpenseModal] = useState(false);
  const [exportPdf, setExportPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseList, setExpenseList] = useState([]);
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(0);
  const [size] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  const openModal = (expense) => {
    setSelectedExpense(expense);
    setOpenViewExpenseModal(true);
  };

  const fetchExpenses = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: size.toString(),
        sortOrder: "desc",
      });

      const response = await api.get(`/api/expenses?${params.toString()}`);
      setExpenseList(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.pageNumber);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async (pageNumber = page) => {
    await fetchExpenses(pageNumber);
  };

  useEffect(() => {
    fetchExpenses(page);
  }, [page]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/public/categories?pageSize=100");
        setCategories(response.data.content);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Disable body scroll when modals are open
  useEffect(() => {
    const shouldLock = openViewExpenseModal || openCreateExpenseModal;
    document.body.style.overflow = shouldLock ? "hidden" : "auto";
  }, [openViewExpenseModal, openCreateExpenseModal]);

  return (
    <>
      <ExpenseViewModal
        open={openViewExpenseModal}
        setOpen={setOpenViewExpenseModal}
        expense={selectedExpense}
        onUpdateSuccess={() => {}}
      />

      <div className='flex flex-col items-center justify-start min-h-full w-full bg-white font-sans overflow-x-hidden'>
        <div className='w-full max-w-5xl space-y-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-black'>Expenses</h1>
            <div className='flex gap-2'>
              <button
                onClick={() => setOpenCreateExpenseModal(true)}
                className='px-4 py-2 bg-black text-white font-semibold rounded-md shadow hover:bg-gray-800 transition duration-300'
              >
                + New Expense
              </button>
              <button
                onClick={() => setExportPdf(true)}
                className='px-4 py-2 bg-black text-white font-semibold rounded-md shadow hover:bg-gray-800 transition duration-300'
              >
                Export PDF
              </button>
            </div>
          </div>

          <CreateExpenseDialog
            isOpen={openCreateExpenseModal}
            onClose={() => {
              setOpenCreateExpenseModal(false);
              refreshData(0);
            }}
          />

          {loading ? (
            <div className='mt-12 text-center text-gray-700 font-semibold text-lg'>
              Loading expenses...
            </div>
          ) : (
            <div className='mt-15'>
              <ExpenseList
                expenses={expenseList}
                loading={loading}
                onDeleteSuccess={() => refreshData(page)}
                openModal={openModal}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Expenses;
