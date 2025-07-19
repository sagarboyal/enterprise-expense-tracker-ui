import { useEffect, useState, useCallback, Fragment } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ExpenseViewModal from "./ExpenseViewModal";
import ExpenseList from "./ExpenseList";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import ExpenseFilterBar from "./ExpenseFilterBar";
import {
  PlusIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

// --- Helper Components for better UI feedback ---

const Spinner = ({
  className = "h-8 w-8",
  borderColor = "border-indigo-600",
}) => (
  <div className='flex justify-center items-center py-20'>
    <div
      className={`${className} animate-spin rounded-full border-b-2 ${borderColor}`}
    ></div>
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

const CreateExpenseDialog = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      amount: "",
      categoryId: "",
      expenseDate: "",
      description: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  const afterLeave = () => {
    reset();
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    const { title, amount, categoryId, expenseDate, description } = data;
    const sendData = {
      title: title.trim(),
      amount: parseFloat(amount),
      categoryId,
      expenseDate: new Date(expenseDate).toISOString(),
      description: description.trim(),
    };

    try {
      await api.post("/api/expenses", sendData);
      toast.success("New expense added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add expense. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment} afterLeave={afterLeave}>
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
                  Add a New Expense
                </Dialog.Title>
                <p className='mt-1 text-sm text-gray-500'>
                  Fill in the details below to add a new expense to your
                  tracker.
                </p>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className='mt-6 space-y-4'
                >
                  <div className='relative'>
                    <PencilSquareIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                    <input
                      {...register("title", { required: "Title is required." })}
                      placeholder='e.g., Team Lunch'
                      className={`w-full rounded-lg border-gray-300 py-2.5 pl-10 shadow-sm focus:ring-2 ${
                        errors.title ? "ring-red-500" : "focus:ring-indigo-500"
                      }`}
                    />
                    {errors.title && (
                      <p className='text-xs text-red-600 mt-1'>
                        {errors.title.message}
                      </p>
                    )}
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
                      {errors.amount && (
                        <p className='text-xs text-red-600 mt-1'>
                          {errors.amount.message}
                        </p>
                      )}
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
                      {errors.expenseDate && (
                        <p className='text-xs text-red-600 mt-1'>
                          {errors.expenseDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='relative'>
                    <TagIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                    <select
                      {...register("categoryId", {
                        required: "Category is required.",
                      })}
                      defaultValue=''
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
                    {errors.categoryId && (
                      <p className='text-xs text-red-600 mt-1'>
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <textarea
                      {...register("description")}
                      rows={3}
                      placeholder='Add a description (optional)...'
                      className='w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500'
                    />
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
                            className='h-5 w-5 mr-2 !py-0'
                            borderColor='border-white/50 border-b-white'
                          />
                          Saving...
                        </>
                      ) : (
                        "Add Expense"
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

export default CreateExpenseDialog;
