import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";

const UpdateExpenseDialog = ({ expense, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch all categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/public/categories?pageSize=100");
        setCategories(response.data.content || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch current expense category to get categoryId
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (expense?.category) {
          const response = await api.get(
            `/api/public/categories/name/${expense.category}`
          );
          setCategoryData(response.data);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category.");
      }
    };

    fetchCategory();
  }, [expense?.category]);

  // Reset form once categoryData is available
  useEffect(() => {
    if (expense && categoryData) {
      reset({
        id: expense.id,
        title: expense.title,
        amount: expense.amount,
        categoryId: categoryData.id,
        expenseDate: expense.expenseDate
          ? new Date(expense.expenseDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [categoryData]);

  const handleFormSubmit = async (data) => {
    const { id, title, amount, categoryId, expenseDate } = data;
    const sendData = {
      id,
      title: title.trim(),
      amount: parseFloat(amount),
      categoryId,
      expenseDate: new Date(expenseDate).toISOString(),
    };

    try {
      setLoading(true);
      const response = await api.put("/api/expenses", sendData);
      toast.success("Expense updated successfully.");
      reset();
      if (response.data) {
        onClose();
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 backdrop-blur-xs bg-black/30 flex items-center justify-center'>
      <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200'>
        <h2 className='text-2xl font-bold mb-6 text-black text-center'>
          Update Expense
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-5'>
          {/* Title */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Title
            </label>
            <input
              {...register("title", { required: true })}
              className={`w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={loading}
            />
            {errors.title && (
              <p className='text-red-500 text-xs mt-1'>Title is required</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Amount
            </label>
            <input
              type='number'
              step='0.01'
              {...register("amount", { required: true })}
              className={`w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.amount
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={loading}
            />
            {errors.amount && (
              <p className='text-red-500 text-xs mt-1'>Amount is required</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Category
            </label>
            <select
              {...register("categoryId", { required: true })}
              className={`w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.categoryId
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={loading}
            >
              <option value='' disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className='text-red-500 text-xs mt-1'>Category is required</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Date
            </label>
            <input
              type='date'
              {...register("expenseDate", { required: true })}
              className={`w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.expenseDate
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={loading}
            />
            {errors.expenseDate && (
              <p className='text-red-500 text-xs mt-1'>Date is required</p>
            )}
          </div>

          {/* Buttons */}
          <div className='flex justify-end gap-4 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition'
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition'
            >
              {loading ? "Saving..." : "Update Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateExpenseDialog;
