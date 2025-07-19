import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";
import {
  PencilSquareIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

const Spinner = ({ className = "h-5 w-5", borderColor = "border-white" }) => (
  <div
    className={`${className} animate-spin rounded-full border-b-2 ${borderColor}`}
  ></div>
);

const UpdateExpenseDialog = ({ expense, isOpen, onClose, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (isOpen && expense) {
        try {
          const categoriesResponse = await api.get(
            "/api/public/categories?pageSize=100"
          );
          const allCategories = categoriesResponse.data.content || [];
          setCategories(allCategories);

          const currentCategory = allCategories.find(
            (c) => c.name === expense.category
          );

          reset({
            id: expense.id,
            title: expense.title,
            amount: expense.amount,
            categoryId: currentCategory ? currentCategory.id : "",
            expenseDate: expense.expenseDate
              ? new Date(expense.expenseDate).toISOString().split("T")[0]
              : "",
            description: expense.description,
          });
        } catch (error) {
          console.error("Error setting up form data:", error);
          toast.error("Failed to load expense data for editing.");
        }
      }
    };
    fetchAndSetData();
  }, [isOpen, expense, reset]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    const { id, title, amount, categoryId, expenseDate, description, file } =
      data;
    const sendData = {
      id,
      title: title.trim(),
      amount: parseFloat(amount),
      categoryId,
      date: new Date(expenseDate).toISOString(),
      description: description.trim(),
    };

    try {
      await api.put("/api/expenses", sendData);

      if (file && file.length > 0) {
        const formData = new FormData();
        formData.append("file", file[0]);
        await api.post(`/api/document/${id}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Expense updated successfully.");
      if (onUpdateSuccess && typeof onUpdateSuccess === "function") {
        onUpdateSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error(error.response?.data?.message || "Failed to update expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-xl font-bold leading-6 text-gray-900'
                >
                  Update Expense
                </Dialog.Title>
                <p className='mt-1 text-sm text-gray-500'>
                  Modify the details of your expense below.
                </p>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className='mt-6 space-y-4'
                >
                  {/* Form fields with icons and improved styling */}
                  <div className='relative'>
                    <PencilSquareIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                    <input
                      {...register("title", { required: "Title is required." })}
                      placeholder='Expense Title'
                      className={`w-full rounded-lg border-gray-300 py-2.5 pl-10 shadow-sm focus:ring-2 ${
                        errors.title ? "ring-red-500" : "focus:ring-indigo-500"
                      }`}
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='relative'>
                      <CurrencyDollarIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                      <input
                        type='number'
                        step='0.01'
                        {...register("amount", {
                          required: "Amount is required.",
                          valueAsNumber: true,
                        })}
                        placeholder='Amount'
                        className={`w-full rounded-lg border-gray-300 py-2.5 pl-10 shadow-sm focus:ring-2 ${
                          errors.amount
                            ? "ring-red-500"
                            : "focus:ring-indigo-500"
                        }`}
                      />
                    </div>
                    <div className='relative'>
                      <CalendarDaysIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                      <input
                        type='date'
                        {...register("expenseDate", {
                          required: "Date is required.",
                        })}
                        className={`w-full rounded-lg border-gray-300 py-2.5 pl-10 shadow-sm focus:ring-2 ${
                          errors.expenseDate
                            ? "ring-red-500"
                            : "focus:ring-indigo-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div className='relative'>
                    <TagIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                    <select
                      {...register("categoryId", {
                        required: "Category is required.",
                      })}
                      className={`w-full appearance-none rounded-lg border-gray-300 py-2.5 pl-10 pr-10 shadow-sm focus:ring-2 ${
                        errors.categoryId
                          ? "ring-red-500"
                          : "focus:ring-indigo-500"
                      }`}
                    >
                      <option value='' disabled>
                        Select a category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <textarea
                      {...register("description")}
                      rows={3}
                      placeholder='Update description (optional)...'
                      className='w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Attach New Document (Optional)
                    </label>
                    <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
                      <div className='space-y-1 text-center'>
                        <ArrowUpTrayIcon className='mx-auto h-12 w-12 text-gray-400' />
                        <div className='flex text-sm text-gray-600'>
                          <label
                            htmlFor='file-upload'
                            className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none'
                          >
                            <span>Upload a file</span>
                            <input
                              id='file-upload'
                              {...register("file")}
                              type='file'
                              className='sr-only'
                            />
                          </label>
                          <p className='pl-1'>or drag and drop</p>
                        </div>
                        <p className='text-xs text-gray-500'>
                          PDF, PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end gap-4 pt-4'>
                    <button
                      type='button'
                      onClick={onClose}
                      className='rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-200'
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      disabled={loading}
                      className='inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400'
                    >
                      {loading ? (
                        <>
                          <Spinner
                            className='h-5 w-5 mr-2'
                            borderColor='border-white/50 border-b-white'
                          />
                          Saving...
                        </>
                      ) : (
                        "Update Expense"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateExpenseDialog;
