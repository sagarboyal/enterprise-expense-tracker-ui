import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ExpenseViewModal from "./ExpenseViewModal";
import ExpenseList from "./ExpenseList";
import CreateExpenseDialog from "./CreateExpenseDialog";
import ExpenseFilterBar from "./ExpenseFilterBar";
import AdvancedFilterDialog from "./AdvancedFilterDialog";
import {
  PlusIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const Spinner = () => (
  <div className='flex justify-center items-center py-20'>
    <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600'></div>
  </div>
);

const EmptyState = () => (
  <div className='text-center py-16 px-4 bg-white rounded-lg shadow-sm border'>
    <CurrencyDollarIcon className='mx-auto h-12 w-12 text-gray-300' />
    <h3 className='mt-2 text-lg font-semibold text-gray-800'>
      No Expenses Found
    </h3>
    <p className='mt-1 text-sm text-gray-500'>
      Try adjusting your filters or create a new expense.
    </p>
  </div>
);

const Expenses = () => {
  const [openViewExpenseModal, setOpenViewExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openCreateExpenseModal, setOpenCreateExpenseModal] = useState(false);
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
  });

  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const fetchExpenses = useCallback(
    async (pageNumber = 0, customFilters = filters) => {
      setLoading(true);
      try {
        const filteredEntries = Object.entries(customFilters).filter(
          ([_, value]) => value !== null && value !== ""
        );

        const params = new URLSearchParams({
          pageNumber: pageNumber.toString(),
          pageSize: size.toString(),
          sortOrder: "desc",
          ...Object.fromEntries(filteredEntries),
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
    },
    [filters, size]
  );

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    const toastId = toast.loading("Generating PDF export...");

    try {
      const filteredEntries = Object.entries(filters).filter(
          ([_, value]) => value !== null && value !== ""
      );
      const params = new URLSearchParams({
        ...Object.fromEntries(filteredEntries),
        export: "true",
      });

      const response = await api.get(`/api/expenses?${params.toString()}`, {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
        },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });

      // If response is empty, throw
      if (blob.size === 0) {
        throw new Error("No data to export. Try adjusting your filters.");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
          "download",
          `expenses-${new Date().toISOString().replace(/:/g, "-")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);

      toast.success("PDF export successful!", { id: toastId });
    } catch (error) {
      let errorMessage = "Failed to export PDF.";

      if (error.code === "ERR_NETWORK") {
        errorMessage =
            "Export succeeded, but browser blocked the response. Ignore this if the file downloaded.";
      }

      toast.success(errorMessage, { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };


  const resetFiltersAndFetch = () => {
    const clearedFilters = {
      title: null,
      categoryName: null,
      status: null,
      startDate: null,
      endDate: null,
      minAmount: null,
      maxAmount: null,
    };
    setFilters(clearedFilters);
    setPage(0);
    fetchExpenses(0, clearedFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      fetchExpenses(newPage);
    }
  };

  const handleCloseModal = () => {
    setOpenViewExpenseModal(false);
  };

  useEffect(() => {
    fetchExpenses(0);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/public/categories?pageSize=100");
        setCategories(response.data.content);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <ExpenseViewModal
        open={openViewExpenseModal}
        setOpen={setOpenViewExpenseModal}
        expense={selectedExpense}
        onUpdateSuccess={() => fetchExpenses(page)}
        onClose={handleCloseModal}
      />
      <CreateExpenseDialog
        isOpen={openCreateExpenseModal}
        onClose={() => {
          setOpenCreateExpenseModal(false);
          fetchExpenses(0);
        }}
      />
      <AdvancedFilterDialog
        isOpen={openAdvanceFilter}
        onClose={() => setOpenAdvanceFilter(false)}
        filters={filters}
        setFilters={setFilters}
        onSearch={(updatedFilters) => {
          setPage(0);
          fetchExpenses(0, updatedFilters);
        }}
        categories={categories}
      />
      <div className='bg-gray-50 min-h-screen w-full p-4 sm:p-6 lg:p-8 font-[Poppins]'>
        <div className='max-w-7xl mx-auto space-y-6'>
          <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Manage Expenses
              </h1>
              <p className='mt-1 text-sm text-gray-600'>
                Track, filter, and export all your team's expenses.
              </p>
            </div>
            <div className='flex-shrink-0 flex gap-2'>
              <button
                onClick={() => setOpenCreateExpenseModal(true)}
                className='inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition'
              >
                <PlusIcon className='h-5 w-5' />
                New Expense
              </button>

              <button
                  // 3. Use the onClick handler and disable the button when loading
                  onClick={handleExport}
                  disabled={isExporting}
                  className='inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <DocumentArrowDownIcon className='h-5 w-5' />
                {isExporting ? "Exporting..." : "Export PDF"}
              </button>
            </div>
          </header>
          <ExpenseFilterBar
            filters={filters}
            setFilters={setFilters}
            onToggleAdvanced={() => setOpenAdvanceFilter(true)}
            onSearch={() => fetchExpenses(0)}
            onReset={resetFiltersAndFetch}
          />
          {loading ? (
            <Spinner />
          ) : expenseList.length === 0 ? (
            <EmptyState />
          ) : (
            <ExpenseList
              expenses={expenseList}
              openModal={(expense) => {
                setSelectedExpense(expense);
                setOpenViewExpenseModal(true);
              }}
              onDeleteSuccess={() => fetchExpenses(page)}
              page={page}
              totalPages={totalPages}
              t
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Expenses;
