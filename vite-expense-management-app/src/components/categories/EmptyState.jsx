import { PlusIcon, TagIcon } from "@heroicons/react/24/solid";

const EmptyState = ({ onButtonClick }) => (
  <div className="text-center py-16 px-4 bg-white rounded-lg shadow-sm border">
    <TagIcon className="mx-auto h-12 w-12 text-gray-300" />
    <h3 className="mt-2 text-lg font-semibold text-gray-800">
      No Categories Found
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Try adjusting your filters or create your first category.
    </p>
    <div className="mt-6">
      <button
        type="button"
        onClick={onButtonClick}
        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
      >
        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
        Create Category
      </button>
    </div>
  </div>
);

export default EmptyState;
