import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Paginations = ({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  className = "",
  style = {},
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div
      className={`d-flex align-items-center justify-content-center ${className}`}
      style={{ gap: "1rem", ...style }}
    >
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <FaArrowLeft />
      </button>

      <span className="fw-semibold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Paginations;
