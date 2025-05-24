import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarComponent from "../NavbarComponent";
import Sidebar from "../Sidebar";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaChartBar, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import AddReportModal from "../../modals/AddReportModal";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ExportReport from "./ExportReport";

function Reports() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingReportId, setDeletingReportId] = useState(null);
  const [generatingReportId, setGeneratingReportId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);

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
      setError("Failed to load reports.");
    }
    setLoading(false);
  };

  const handleReportAdded = () => {
    fetchReports();
    toast.success("Report added successfully!");
  };

  const confirmDeleteReport = (reportId) => {
    setDeletingReportId(reportId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteReport = async () => {
    if (!deletingReportId) return;
    try {
      await axios.delete(
        `https://formx360.onrender.com/reports/report/${deletingReportId}`
      );
      toast.success("Report deleted successfully!");
      fetchReports();
    } catch (err) {
      console.error("Error deleting report:", err);
      toast.error("Failed to delete report.");
    }
    setShowDeleteConfirm(false);
    setDeletingReportId(null);
  };

  const generateReport = async (reportId) => {
    setGeneratingReportId(reportId);
    try {
      const reportResponse = await axios.get(
        `https://formx360.onrender.com/reports/report/${reportId}`
      );
      const filters = reportResponse.data.filters || [];

      const result = await axios.post(
        `https://formx360.onrender.com/reports/report/${reportId}/filter`,
        { filters }
      );

      const data = result.data;

      setReportData(data);
      setAvailableFields(data.length > 0 ? Object.keys(data[0]) : []);
      setShowExportModal(true);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report.");
    }
    setGeneratingReportId(null);
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
                    <Button
                      variant="primary"
                      onClick={() => setShowAddModal(true)}
                      disabled={loading}
                      aria-label="Add Report"
                    >
                      <FaPlus /> Add Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Row>

            {/* Loading Spinner */}
            {loading && (
              <div className="text-center my-4">
                <Spinner animation="border" role="status" />
              </div>
            )}

            {/* Error Message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Empty State */}
            {!loading && reports.length === 0 && !error && (
              <div className="text-center mt-5 text-muted">
                <p>No reports available.</p>
                <p>
                  <em>
                    Create your first report by clicking "Add Report" above.
                  </em>
                </p>
              </div>
            )}

            {/* Reports List */}
            <Row>
              {reports.map((report) => (
                <Col key={report._id} md={6} lg={4} className="mb-4">
                  <Card
                    className="shadow-sm border-0 rounded-4"
                    role="group"
                    tabIndex={0}
                    aria-label={`Report: ${report.title}`}
                    style={{ transition: "box-shadow 0.3s" }}
                    onFocus={(e) => e.currentTarget.classList.add("shadow-lg")}
                    onBlur={(e) =>
                      e.currentTarget.classList.remove("shadow-lg")
                    }
                    onMouseEnter={(e) =>
                      e.currentTarget.classList.add("shadow-lg")
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.classList.remove("shadow-lg")
                    }
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5>{report.title}</h5>
                          <p className="text-muted">
                            Related Form:{" "}
                            <strong>{report.formId?.title || "N/A"}</strong>
                          </p>
                        </div>
                        <div className="d-flex gap-2">
                          <OverlayTrigger
                            overlay={<Tooltip>Edit Report</Tooltip>}
                            placement="top"
                          >
                            <Button
                              variant="outline-primary"
                              className="shadow-sm"
                              onClick={() =>
                                navigate(`/report-builder/${report._id}`)
                              }
                              disabled={loading || generatingReportId !== null}
                              aria-label={`Edit report ${report.title}`}
                            >
                              <FaEdit />
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            overlay={<Tooltip>Generate Report</Tooltip>}
                            placement="top"
                          >
                            <Button
                              variant="primary"
                              className="shadow-sm d-flex align-items-center justify-content-center"
                              onClick={() => generateReport(report._id)}
                              disabled={loading || generatingReportId !== null}
                              aria-label={`Generate report ${report.title}`}
                            >
                              {generatingReportId === report._id ? (
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              ) : (
                                <FaChartBar size={18} />
                              )}
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            overlay={<Tooltip>Delete Report</Tooltip>}
                            placement="top"
                          >
                            <Button
                              variant="outline-danger"
                              className="shadow-sm"
                              onClick={() => confirmDeleteReport(report._id)}
                              disabled={loading || generatingReportId !== null}
                              aria-label={`Delete report ${report.title}`}
                            >
                              <FaTrash />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>

          <AddReportModal
            show={showAddModal}
            handleClose={() => setShowAddModal(false)}
            onReportAdded={handleReportAdded}
          />

          <ExportReport
            showModal={showExportModal}
            setShowModal={setShowExportModal}
            reportData={reportData}
            availableFields={availableFields}
          />

          {/* Confirm Delete Modal */}
          <Modal
            show={showDeleteConfirm}
            onHide={() => setShowDeleteConfirm(false)}
            centered
            aria-labelledby="confirm-delete-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="confirm-delete-modal">
                Confirm Delete
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this report? This action cannot be
              undone.
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteReport}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          <ToastContainer position="top-right" autoClose={3000} />
        </main>
      </div>
    </>
  );
}

export default Reports;
