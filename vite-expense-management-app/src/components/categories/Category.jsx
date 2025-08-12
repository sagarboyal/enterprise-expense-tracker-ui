import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import CategoryDialog from "./CategoryDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import EmptyState from "./EmptyState";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
  </div>
);

const Category = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openAdvanceFilter, setOpenAdvanceFilter] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    sortBy: "name",
    sortOrder: "desc",
  });
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCategories = useCallback(
    async (pageNumber = 0, currentFilters = filters) => {
      setLoading(true);
      try {
        const filteredEntries = Object.entries(currentFilters).filter(
          ([_, value]) => value !== null && value !== "",
        );

        const params = new URLSearchParams({
          pageNumber: pageNumber.toString(),
          pageSize: size.toString(),
          ...Object.fromEntries(filteredEntries),
        });

        const response = await api.get(
          `/api/public/categories?${params.toString()}`,
        );
        setCategories(response.data.content);
        setTotalPages(response.data.totalPages);
        setPage(response.data.pageNumber);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    },
    [size, filters],
  );

  useEffect(() => {
    fetchCategories(0, filters);
  }, [filters, fetchCategories]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, name: value }));
    }, 500);
    return () => clearTimeout(timer);
  };

  const resetFilters = () => {
    setFilters({ name: "", sortBy: "name", sortOrder: "desc" });
    document.getElementById("search-input").value = "";
  };

  const handleSaveCategory = async (data) => {
    const apiCall = data.id
      ? api.put("/api/admin/categories", data)
      : api.post("/api/admin/categories", data);

    const toastPromise = toast.promise(apiCall, {
      loading: data.id ? "Updating category..." : "Creating category...",
      success: `Category ${data.id ? "updated" : "created"} successfully!`,
      error: `Failed to ${data.id ? "update" : "create"} category.`,
    });

    try {
      await toastPromise;
      setIsDialogOpen(false);
      setEditingCategory(null);
      fetchCategories(page, filters);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteCategory = (id) => {
    setDeletingCategoryId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCategoryId) return;

    const toastPromise = toast.promise(
      api.delete(`/api/admin/categories/${deletingCategoryId}`),
      {
        loading: "Deleting category...",
        success: "Category deleted successfully!",
        error: "Failed to delete category.",
      },
    );

    try {
      await toastPromise;
      fetchCategories(page, filters);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsConfirmOpen(false);
      setDeletingCategoryId(null);
    }
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title="Delete Category"
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      >
        Are you sure you want to delete this category? This action cannot be
        undone.
      </ConfirmationDialog>

      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Category Management
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                type="button"
                onClick={openCreateDialog}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
                Create Category
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search by category name..."
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => setOpenAdvanceFilter(!openAdvanceFilter)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                Advanced Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Reset
              </button>
            </div>
            {/* Advanced Filter Drawer */}
            {openAdvanceFilter && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"><div>
                  <label
                    htmlFor="sortBy"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sort By
                  </label>
                  <select
                    id="sortBy"
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="name">Name</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="sortOrder"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Order
                  </label>
                  <select
                    id="sortOrder"
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow-sm">
            {loading ? (
              <LoadingSpinner />
            ) : categories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-x-4">
                            <button
                              onClick={() => openEditDialog(category)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState onButtonClick={openCreateDialog} />
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => fetchCategories(page - 1)}
                    disabled={page === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchCategories(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{page + 1}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => fetchCategories(page - 1)}
                        disabled={page === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      {/* Page numbers can be added here if needed */}
                      <button
                        onClick={() => fetchCategories(page + 1)}
                        disabled={page >= totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
