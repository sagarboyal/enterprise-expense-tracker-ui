import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";

const CreateExpenseDialog = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

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
      setShowDialog(true);
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/public/categories?pageSize=100");
      setCategories(response.data.content || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories.");
    }
  };

  const handleClose = () => {
    setShowDialog(false);
  };

  const afterLeave = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    const { title, amount, categoryId, expenseDate, description } = data;
    const sendData = {
      title: title.trim(),
      amount: parseFloat(amount),
      categoryId,
      expenseDate: new Date(expenseDate).toISOString(),
      description: description.trim(),
    };

    try {
      setLoading(true);
      const response = await api.post("/api/expenses", sendData);
      toast.success("New expense added to your tracker.", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      if (response.data) handleClose();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={showDialog} as={Fragment} afterLeave={afterLeave}>
      <Dialog as='div' className='relative z-50' onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-150'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-200'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-150'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-200 font-[Poppins]'>
                <Dialog.Title
                  as='h3'
                  className='text-2xl font-semibold text-center text-black mb-6'
                >
                  Add Expense
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className='space-y-5'
                >
                  <FormField
                    label='Title'
                    type='text'
                    register={register("title", { required: true })}
                    error={errors.title}
                    placeholder='Expense title'
                    disabled={loading}
                  />

                  <FormField
                    label='Amount'
                    type='number'
                    step='0.01'
                    register={register("amount", { required: true })}
                    error={errors.amount}
                    placeholder='Expense amount'
                    disabled={loading}
                  />

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Category
                    </label>
                    <select
                      {...register("categoryId", { required: true })}
                      defaultValue=''
                      disabled={loading}
                      className={`w-full border px-4 py-2 rounded-md shadow-sm font-[Poppins] focus:outline-none focus:ring-2 ${
                        errors.categoryId
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
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
                      <p className='text-red-500 text-xs mt-1'>
                        Category is required
                      </p>
                    )}
                  </div>

                  <FormField
                    label='Date'
                    type='date'
                    register={register("expenseDate", { required: true })}
                    error={errors.expenseDate}
                    disabled={loading}
                  />

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Description
                    </label>
                    <textarea
                      rows={4}
                      {...register("description", { required: true })}
                      className={`w-full border px-4 py-2 rounded-md shadow-sm resize-none font-[Poppins] focus:outline-none focus:ring-2 ${
                        errors.description
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder='Write a detailed description...'
                      disabled={loading}
                    />
                    {errors.description && (
                      <p className='text-red-500 text-xs mt-1'>
                        Description is required
                      </p>
                    )}
                  </div>

                  <div className='flex justify-end gap-4 pt-4'>
                    <button
                      type='button'
                      onClick={handleClose}
                      className='px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition font-[Poppins]'
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      disabled={loading}
                      className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition font-[Poppins]'
                    >
                      {loading ? "Saving..." : "Add Expense"}
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

// Reusable input field component
const FormField = ({
  label,
  type,
  step,
  register,
  error,
  placeholder,
  disabled,
}) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
    </label>
    <input
      type={type}
      step={step}
      {...register}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full border px-4 py-2 rounded-md shadow-sm font-[Poppins] focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
    />
    {error && <p className='text-red-500 text-xs mt-1'>{label} is required</p>}
  </div>
);

export default CreateExpenseDialog;
