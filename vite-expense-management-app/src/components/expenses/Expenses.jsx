import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ExpenseViewModal from "./ExpenseViewModal";
import ExpenseList from "./ExpenseList";
import CreateExpenseDialog from "./CreateExpenseDialog";
import ExpenseFilterBar from "../utils/ExpenseFilterBar";

const Expenses = () => {
  const [openViewExpenseModal, setOpenViewExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openCreateExpenseModal, setOpenCreateExpenseModal] = useState(false);
  const [exportPdf, setExportPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseList, setExpenseList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openAdvanceFilter, setOpenAdvanceFilter] = useState(false);

  const [filters, setFilters] = useState({
    title: null,
    categoryName: null,
    status: null,
    startDate: null,
    endDate: null,
    minAmount: null,
    maxAmount: null,
    export: false,
  });

  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const openModal = (expense) => {
    setSelectedExpense(expense);
    setOpenViewExpenseModal(true);
  };

  const fetchExpenses = async (pageNumber = 0, triggerExport = false) => {
    try {
      setLoading(true);

      const filteredEntries = Object.entries(filters).filter(
        ([_, value]) => value !== null && value !== ""
      );

      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: size.toString(),
        sortOrder: "desc",
        ...Object.fromEntries(filteredEntries),
        export: triggerExport || filters.export ? "true" : "false",
      });

      const response = await api.get(`/api/expenses?${params.toString()}`);
      setExpenseList(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.pageNumber);

      if (triggerExport) {
        toast.success("PDF Export triggered!");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to load expenses.");
    } finally {
      setLoading(false);
      if (triggerExport) setExportPdf(false); // Reset export flag
    }
  };

  const handleExport = () => {
    setExportPdf(true);
    fetchExpenses(0, true);
  };

  const resetFilters = () => {
    setFilters({
      title: null,
      categoryName: null,
      status: null,
      startDate: null,
      endDate: null,
      minAmount: null,
      maxAmount: null,
      export: false,
    });
    setPage(0);
    fetchExpenses(0);
  };

  const refreshData = async (pageNumber = page) => {
    await fetchExpenses(pageNumber);
  };

  useEffect(() => {
    fetchExpenses(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      <CreateExpenseDialog
        isOpen={openCreateExpenseModal}
        onClose={() => {
          setOpenCreateExpenseModal(false);
          refreshData(0);
        }}
      />

      <div className='flex flex-col items-center justify-start min-h-screen w-full bg-white font-sans overflow-x-hidden'>
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
                onClick={handleExport}
                className='px-4 py-2 bg-black text-white font-semibold rounded-md shadow hover:bg-gray-800 transition duration-300'
              >
                Export PDF
              </button>
            </div>
          </div>

          <ExpenseFilterBar
            filters={filters}
            setFilters={setFilters}
            onToggleAdvanced={() => setOpenAdvanceFilter((prev) => !prev)}
            onSearch={() => {
              setPage(0);
              fetchExpenses(0);
            }}
          />

          {loading ? (
            <div className='mt-12 text-center text-gray-700 font-semibold text-lg'>
              Loading expenses...
            </div>
          ) : expenseList.length === 0 ? (
            <div className='mt-12 text-center text-gray-500 font-medium'>
              No expenses found.
            </div>
          ) : (
            <div className='mt-4'>
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
