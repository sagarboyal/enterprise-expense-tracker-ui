import { useEffect, useState } from "react";
import ExpenseViewModal from "./expenses/ExpenseViewModal";
import CreateExpenseDialog from "./expenses/CreateExpenseDialog";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useMyContext } from "../store/ContextApi";
import toast from "react-hot-toast";
import api from "../services/api";
import ExpenseList from "./expenses/ExpenseList";
import ActionHeader from "./utils/ActionHeader";

const HomePage = () => {
  const { token } = useMyContext();

  const [openViewExpenseModal, setOpenViewExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openCreateExpenseModal, setOpenCreateExpenseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseList, setExpenseList] = useState([]);
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(0);
  const [size] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    categoryName: null,
    status: null,
    startDate: null,
    endDate: null,
    minAmount: null,
    maxAmount: null,
  });

  const openModal = (expense) => {
    setSelectedExpense(expense);
    setOpenViewExpenseModal(true);
  };

  const fetchExpenses = async (pageNumber = 0) => {
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

  useEffect(() => {
    fetchExpenses(page);
  }, [page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const applyFilters = () => {
    setPage(0);
    fetchExpenses(0);
  };

  const resetFilters = () => {
    setFilters({
      categoryName: null,
      status: null,
      startDate: null,
      endDate: null,
      minAmount: null,
      maxAmount: null,
    });
    setPage(0);
    fetchExpenses(0);
  };

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

  return (
    <>
      {selectedExpense && (
        <ExpenseViewModal
          open={openViewExpenseModal}
          setOpen={setOpenViewExpenseModal}
          expense={selectedExpense}
        />
      )}
      <div className='min-h-screen bg-white p-8 flex flex-col items-center font-sans'>
        <h1 className='text-3xl font-extrabold text-black mb-6 tracking-wide'>
          Expenses
        </h1>

        <ActionHeader
          onAdd={() => setOpenCreateExpenseModal(true)}
          onFilterChange={handleFilterChange}
          onFilterSubmit={applyFilters}
          filters={[
            {
              name: "categoryName",
              type: "select",
              value: filters.categoryName ?? "",
              options: [
                { label: "All Categories", value: "" },
                ...categories.map((c) => ({ label: c.name, value: c.name })),
              ],
            },
            {
              name: "status",
              type: "select",
              value: filters.status ?? "",
              options: [
                { label: "All Statuses", value: "" },
                { label: "Pending", value: "pending" },
                { label: "Manager Approved", value: "manager approve" },
                { label: "Admin Approved", value: "admin approve" },
                { label: "Manager Rejected", value: "manager reject" },
                { label: "Admin Rejected", value: "admin reject" },
              ],
            },
            {
              name: "startDate",
              type: "date",
              value: filters.startDate ?? "",
            },
            {
              name: "endDate",
              type: "date",
              value: filters.endDate ?? "",
            },
            {
              name: "minAmount",
              type: "number",
              value: filters.minAmount ?? "",
              placeholder: "Min Amount",
            },
            {
              name: "maxAmount",
              type: "number",
              value: filters.maxAmount ?? "",
              placeholder: "Max Amount",
            },
          ]}
        >
          <button
            onClick={resetFilters}
            className='ml-4 px-4 py-2 bg-black text-white rounded shadow-sm hover:bg-gray-800 transition'
          >
            Reset
          </button>
        </ActionHeader>

        <CreateExpenseDialog
          isOpen={openCreateExpenseModal}
          onClose={() => {
            setOpenCreateExpenseModal(false);
            fetchExpenses(0);
          }}
        />

        {loading ? (
          <div className='mt-12 text-center text-gray-700 font-semibold text-lg'>
            Loading expenses...
          </div>
        ) : (
          <ExpenseList
            expenses={expenseList}
            loading={loading}
            onDeleteSuccess={() => fetchExpenses(page)}
            openModal={openModal}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
