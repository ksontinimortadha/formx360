import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import NavbarComponent from "../NavbarComponent";
import { Container, Navbar } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import ExportModal from "../../modals/ExportModal";
import exportUtils from "../exportUtils";
import ResponseTable from "./ResponseTable";
import NoResponses from "./NoResponses";
import Paginations from "../Paginations";

const ResponsePage = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = (format) => {
    setShowExportModal(false);
    switch (format) {
      case "csv":
        exportUtils.exportToCSV(responses, headers);
        break;
      case "pdf":
        exportUtils.exportToPDF(responses, headers);
        break;
      case "excel":
        exportUtils.exportToExcel(responses, headers);
        break;
      default:
        toast.warn("Unsupported export format.");
    }
  };

  // Fetch responses
  const fetchResponses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/responses/form/${formId}`
      );

      if (response.data.length > 0) {
        const uniqueFields = [
          ...new Set(
            response.data.flatMap((res) => res.responses.map((r) => r.field_id))
          ),
        ];
        setHeaders(uniqueFields);
      }

      setResponses(response.data);
      fetchResponses(formId);
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast.error("Failed to fetch responses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [formId]);

  // Sorting logic
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedResponses = useMemo(() => {
    if (!sortConfig.key) return responses;

    return [...responses].sort((a, b) => {
      let aValue = "";
      let bValue = "";

      if (sortConfig.key === "submitted_at") {
        aValue = new Date(a.submitted_at);
        bValue = new Date(b.submitted_at);
      } else {
        const aField = a.responses.find(
          (res) => res.field_id === sortConfig.key
        );
        const bField = b.responses.find(
          (res) => res.field_id === sortConfig.key
        );
        aValue = aField ? aField.value : "";
        bValue = bField ? bField.value : "";
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [responses, sortConfig]);

  const currentResponses = useMemo(() => {
    const indexOfLastResponse = currentPage * itemsPerPage;
    const indexOfFirstResponse = indexOfLastResponse - itemsPerPage;
    return sortedResponses.slice(indexOfFirstResponse, indexOfLastResponse);
  }, [sortedResponses, currentPage, itemsPerPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-gray-500 mt-6">Loading responses...</p>
      </div>
    );
  }

  if (!responses.length) {
    return (
      <>
        <NoResponses />
      </>
    );
  }

  const handleBackClick = () => {
    navigate(`/forms`);
  };

  const handleEdit = async (updatedResponse) => {
    try {
      const response = await axios.put(
        `https://formx360.onrender.com/responses/${updatedResponse._id}`,
        updatedResponse
      );

      setResponses((prevResponses) =>
        prevResponses.map((res) =>
          res._id === updatedResponse._id ? { ...res, ...response.data } : res
        )
      );

      toast.success("Response edited successfully");
    } catch (error) {
      console.error("Error editing response:", error);
      toast.error("Failed to edit response");
    }
  };

  const handleDelete = async (responseId) => {
    try {
      await axios.delete(
        `https://formx360.onrender.com/responses/${responseId}`
      );

      setResponses((prevResponses) =>
        prevResponses.filter((res) => res._id !== responseId)
      );

      toast.success("Response deleted successfully");
    } catch (error) {
      console.error("Error deleting response:", error);
      toast.error("Failed to delete response");
    }
  };

  return (
    <>
      <NavbarComponent />
      <Navbar className="bg-body-tertiary" style={{ marginBottom: "20px" }}>
        <Container>
          <Navbar.Brand style={{ fontWeight: "500" }}>
            <FaArrowLeft
              style={{ marginRight: "20px" }}
              size={20}
              color="darkgrey"
              onClick={handleBackClick}
            />
            Form Responses
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowExportModal(true)}
              >
                Export All
              </button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Table for displaying responses */}
      <ResponseTable
        headers={headers}
        responses={responses}
        currentResponses={currentResponses}
        sortConfig={sortConfig}
        requestSort={requestSort}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Pagination controls */}

      <Navbar
        className="bg-body-tertiary"
        fixed="bottom"
        style={{ height: "70px", borderTop: "1px solid #dee2e6" }}
      >
        <Container className="d-flex justify-content-between align-items-center">
          <Navbar.Brand style={{ fontWeight: "bolder" }}></Navbar.Brand>
          <Paginations
            totalItems={responses.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            style={{ marginBottom: "0" }}
          />
        </Container>
      </Navbar>

      <ExportModal
        show={showExportModal}
        handleClose={() => setShowExportModal(false)}
        handleExport={handleExport}
      />
    </>
  );
};

export default ResponsePage;
