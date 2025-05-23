import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const UserResponsePage = () => {
  const [responses, setResponses] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showExportModal, setShowExportModal] = useState(false);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

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

  const fetchResponses = async () => {
    if (!userId) return;
    console.log("Fetching responses for userId:", userId);

    setLoading(true);
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/responses/user/${userId}`
      );
      const data = response.data ;
console.log('data',data)
      if (data.length > 0) {
        const uniqueFields = [
          ...new Set(
            data.flatMap((res) => (res.responses || []).map((r) => r.field_id))
          ),
        ];
        setHeaders(uniqueFields);
      } else {
        setHeaders([]);
      }

      setResponses(data);
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast.error("Failed to fetch responses.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (userId) {
      fetchResponses();
    }
  }, [userId]);

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
      let aValue = "",
        bValue = "";

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
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return sortedResponses.slice(indexOfFirst, indexOfLast);
  }, [sortedResponses, currentPage, itemsPerPage]);

  const handleBackClick = () => {
    navigate(`/forms`);
  };

  const handleEdit = async (updatedResponse) => {
    try {
      const res = await axios.put(
        `https://formx360.onrender.com/responses/${updatedResponse._id}`,
        updatedResponse
      );
      setResponses((prev) =>
        prev.map((r) =>
          r._id === updatedResponse._id ? { ...r, ...res.data } : r
        )
      );
      toast.success("Response edited successfully");
    } catch (error) {
      console.error("Error editing response:", error);
      toast.error("Failed to edit response");
    }
  };

  const handleDelete = async (responseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this response? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `https://formx360.onrender.com/responses/${responseId}`
      );
      setResponses((prev) => prev.filter((r) => r._id !== responseId));
      toast.success("Response deleted successfully");
    } catch (error) {
      console.error("Error deleting response:", error);
      toast.error("Failed to delete response");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-gray-500 mt-6">Loading responses...</p>
      </div>
    );
  }

  if (!responses.length) {
    return <NoResponses />;
  }

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

      <ResponseTable
        headers={headers}
        responses={responses}
        currentResponses={currentResponses}
        sortConfig={sortConfig}
        requestSort={requestSort}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <Navbar
        className="bg-body-tertiary"
        fixed="bottom"
        style={{ height: "70px", borderTop: "1px solid #dee2e6" }}
      >
        <Container className="d-flex justify-content-between align-items-center">
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

export default UserResponsePage;
