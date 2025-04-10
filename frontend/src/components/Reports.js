import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarComponent from "./NavbarComponent";
import Sidebar from "./Sidebar";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import AddReportModal from "../modals/AddReportModal";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Reports() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    const companyId = sessionStorage.getItem("companyId");

    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://formx360.onrender.com/reports/company/${companyId}`
      );
      setReports(response.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again later.");
    }
    setLoading(false);
  };

  const handleReportAdded = () => {
    handleCloseAddModal();
    fetchReports(); // Refresh the list after adding a new report
    toast.success("Report added successfully!");
  };
  const handleDeleteReport = async (reportId) => {
    try {
      await axios.delete(
        `https://formx360.onrender.com/reports/report/${reportId}`
      );
      toast.success("Report deleted successfully!");
      fetchReports(); // Refresh the list after deletion
    } catch (err) {
      console.error("Error deleting report:", err);
      toast.error("Failed to delete report.");
    }
  };

  return (
    <>
      <NavbarComponent />
      <div style={{ height: "100vh", display: "flex" }}>
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <Container>
            <Row className="mb-4">
              <Card className="shadow-sm border-0 rounded-4 w-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>Reports Management</h4>
                    <Button variant="primary" onClick={handleShowAddModal}>
                      <FaPlus /> Add Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Row>

            {/* Loading Spinner */}
            {loading && (
              <div className="text-center my-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}

            {/* Error Message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Reports List */}
            <Row>
              {reports.length > 0
                ? reports.map((report) => (
                    <Col key={report._id} md={6} lg={4} className="mb-4">
                      <Card className="shadow-sm border-0 rounded-4">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5>{report.title}</h5>
                              <p className="text-muted">
                                Related Form:{" "}
                                <strong>{report.formId?.title || "N/A"}</strong>
                              </p>
                            </div>
                            <Button
                              variant="outline-primary"
                              className="shadow-sm"
                              onClick={() =>
                                navigate(`/report-builder/${report._id}`)
                              }
                            >
                              <FaEdit className="me-2" /> Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              className="shadow-sm ms-2"
                              onClick={() => handleDeleteReport(report._id)}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                : !loading &&
                  !error && (
                    <p className="text-center mt-4">No reports available.</p>
                  )}
            </Row>
          </Container>

          <AddReportModal
            show={showAddModal}
            handleClose={handleCloseAddModal}
            onReportAdded={handleReportAdded} // Callback for refreshing the list
          />
          <ToastContainer />
        </main>
      </div>
    </>
  );
}

export default Reports;
