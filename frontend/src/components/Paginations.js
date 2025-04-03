import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Pagination Component
const Paginations = ({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 disabled:bg-gray-400"
        disabled={currentPage === 1}
        style={{ marginRight: "10px" }}
      >
        <FaArrowLeft className="text-gray-600" color="darkgrey" />
      </button>
      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 disabled:bg-gray-400"
        disabled={currentPage === totalPages}
        style={{ marginLeft: "10px" }}
      >
        <FaArrowRight className="text-gray-600" color="darkgrey" />
      </button>
    </div>
  );
};

export default Paginations;
