import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";
import {
  PencilSquareIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalendarDaysIcon,
  ArrowUpTrayIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Spinner = () => (
  <svg
    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    ></circle>
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    ></path>
  </svg>
);

const UpdateExpenseDialog = ({ expense, isOpen, onClose, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isOpen || !expense) return;

    const fetchAndSetData = async () => {
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
        toast.error("Failed to load expense data.");
      }
    };
    fetchAndSetData();
  }, [isOpen, expense, reset]);

  const afterLeave = () => {
    reset();
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    const sendData = {
      id: data.id,
      title: data.title.trim(),
      amount: parseFloat(data.amount),
      categoryId: data.categoryId,
      expenseDate: new Date(data.expenseDate).toISOString(),
      description: data.description.trim(),
    };

    try {
      await api.put("/api/expenses", sendData);
      toast.success("Expense updated successfully!");

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await api.post(`/api/document/cloudinary/upload/${data.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("New receipt uploaded successfully!");
      }

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
    <Transition appear show={isOpen} as={Fragment} afterLeave={afterLeave}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={loading ? () => {} : onClose}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/40 backdrop-blur-sm' />
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
              <Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-2xl font-bold leading-6 text-gray-900'
                >
                  Edit Expense
                </Dialog.Title>
                <p className='mt-2 text-sm text-gray-500'>
                  Update the details of your expense. Changes will be saved
                  immediately.
                </p>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className='mt-8 space-y-6'
                >
                  <fieldset disabled={loading} className='space-y-6'>
                    <div className='relative'>
                      <PencilSquareIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400' />
                      <input
                        {...register("title", {
                          required: "Title is required.",
                        })}
                        placeholder='Expense Title'
                        className={`w-full rounded-lg border-gray-300 py-3 pl-11 shadow-sm focus:ring-2 ${
                          errors.title
                            ? "ring-red-500 border-red-500"
                            : "focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                      />
                      {errors.title && (
                        <p className='text-xs text-red-600 mt-1'>
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                      <div className='relative'>
                        <CurrencyDollarIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400' />
                        <input
                          type='number'
                          step='0.01'
                          {...register("amount", {
                            required: "Amount is required.",
                            valueAsNumber: true,
                            min: {
                              value: 0.01,
                              message: "Amount must be positive.",
                            },
                          })}
                          placeholder='Amount'
                          className={`w-full rounded-lg border-gray-300 py-3 pl-11 shadow-sm focus:ring-2 ${
                            errors.amount
                              ? "ring-red-500 border-red-500"
                              : "focus:ring-indigo-500 focus:border-indigo-500"
                          }`}
                        />
                        {errors.amount && (
                          <p className='text-xs text-red-600 mt-1'>
                            {errors.amount.message}
                          </p>
                        )}
                      </div>
                      <div className='relative'>
                        <CalendarDaysIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400' />
                        <input
                          type='date'
                          {...register("expenseDate", {
                            required: "Date is required.",
                          })}
                          className={`w-full rounded-lg border-gray-300 py-3 pl-11 shadow-sm focus:ring-2 ${
                            errors.expenseDate
                              ? "ring-red-500 border-red-500"
                              : "focus:ring-indigo-500 focus:border-indigo-500"
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
                      <TagIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400' />
                      <select
                        {...register("categoryId", {
                          required: "Please select a category.",
                        })}
                        className={`w-full appearance-none rounded-lg border-gray-300 py-3 pl-11 pr-10 shadow-sm focus:ring-2 ${
                          errors.categoryId
                            ? "ring-red-500 border-red-500"
                            : "focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                      >
                        <option value='' disabled>
                          Select Category
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
                        placeholder='Description (optional)'
                        className='w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Attach New Receipt
                      </label>
                      <div className='mt-2 flex items-center gap-4 rounded-lg border border-dashed border-gray-300 p-4'>
                        <input
                          type='file'
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className='hidden'
                          accept='image/*,.pdf'
                        />
                        <button
                          type='button'
                          onClick={() => fileInputRef.current.click()}
                          className='inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                        >
                          <ArrowUpTrayIcon className='-ml-0.5 mr-2 h-5 w-5' />
                          {selectedFile ? "Change File" : "Choose File"}
                        </button>
                        {selectedFile && (
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <span className='truncate max-w-xs'>
                              {selectedFile.name}
                            </span>
                            <button type='button' onClick={removeSelectedFile}>
                              <XCircleIcon className='h-5 w-5 text-gray-400 hover:text-red-500' />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  <div className='flex justify-end gap-4 pt-4'>
                    <button
                      type='button'
                      onClick={onClose}
                      disabled={loading}
                      className='rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      disabled={loading}
                      className='inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-indigo-400'
                    >
                      {loading && <Spinner />}
                      {loading ? "Saving..." : "Update Expense"}
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
