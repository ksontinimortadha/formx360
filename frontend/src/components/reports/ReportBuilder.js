import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import {
  FaPlus,
  FaTrash,
  FaFilter,
  FaChartBar,
  FaArrowLeft,
  FaSave,
} from "react-icons/fa";
import NavbarComponent from "../NavbarComponent";
import ExportReport from "./ExportReport";

function ReportBuilder() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [filters, setFilters] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/reports/report/${reportId}`
      );
      setReport(response.data);
      setFilters(response.data.filters || []); // Load saved filters
      if (response.data.formId._id) {
        const formResponse = await axios.get(
          `https://formx360.onrender.com/forms/${response.data.formId._id}`
        );
        setAvailableFields(formResponse.data.form.fields || []);
      }
    } catch (error) {
      console.error("Error fetching report or form details:", error);
      toast.error("Failed to load report or form details.");
    }
  };

  const addFilter = () => {
    setFilters([...filters, { field: "", condition: "equals", value: "" }]);
  };

  const updateFilter = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://formx360.onrender.com/reports/report/${reportId}/filter`,
        { filters }
      );
      setReportData(response.data);
      setShowExportModal(true);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  const saveFiltersToReport = async () => {
    setSaving(true);
    try {
      await axios.put(
        `https://formx360.onrender.com/reports/report/${reportId}`,
        { filters }
      );
      toast.success("Filters saved to report successfully!");
    } catch (error) {
      console.error("Error saving filters to report:", error);
      toast.error("Failed to save filters.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <Container fluid className="p-4">
        <FaArrowLeft
          style={{ marginLeft: "20px", marginTop: "20px", cursor: "pointer" }}
          size={20}
          color="darkgrey"
          onClick={() => navigate("/reports")}
        />

        <h2 className="mb-4 text-center text-dark">
          <FaChartBar className="me-2" /> Build Your Report
        </h2>
        {report ? (
          <h4 className="text-center text-secondary">{report.title}</h4>
        ) : (
          <p className="text-center">Loading report details...</p>
        )}

        {/* Filters Section */}
        <Card className="shadow-sm p-4 mt-4 border-0">
          <h5 className="mb-3 text-primary">
            <FaFilter className="me-2" /> Add Filters (Optional)
          </h5>
          <p className="text-muted">
            Customize your report by applying filters to refine the results.
          </p>

          {filters.map((filter, index) => (
            <Row key={index} className="align-items-center mb-3">
              <Col md={3}>
                <Form.Select
                  value={filter.field}
                  onChange={(e) => updateFilter(index, "field", e.target.value)}
                  className="border-0 shadow-sm"
                >
                  <option value="">Choose a Field</option>
                  {availableFields.map((field) => (
                    <option key={field._id} value={field.label}>
                      {field.label || field.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filter.condition}
                  onChange={(e) =>
                    updateFilter(index, "condition", e.target.value)
                  }
                  className="border-0 shadow-sm"
                >
                  <option value="equals">Equals</option>
                  <option value="not_equals">Not Equals</option>
                  <option value="contains">Contains</option>
                  <option value="starts_with">Starts With</option>
                  <option value="ends_with">Ends With</option>
                  <option value="greater_than">Greater Than</option>
                  <option value="greater_or_equal">
                    Greater Than or Equal
                  </option>
                  <option value="less_than">Less Than</option>
                  <option value="less_or_equal">Less Than or Equal</option>
                  <option value="before_date">Before Date</option>
                  <option value="after_date">After Date</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Enter value"
                  value={filter.value}
                  onChange={(e) => updateFilter(index, "value", e.target.value)}
                  className="border-0 shadow-sm"
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="danger"
                  className="shadow-sm"
                  onClick={() => removeFilter(index)}
                >
                  <FaTrash />
                </Button>
              </Col>
            </Row>
          ))}

          <Button
            variant="outline-primary"
            onClick={addFilter}
            className="mt-3 shadow-sm"
          >
            <FaPlus className="me-2" /> Add Filter
          </Button>
        </Card>

        {/* Action Buttons */}
        <div className="text-center mt-4 d-flex justify-content-center gap-3 flex-wrap">
          <Button
            variant="success"
            size="lg"
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <FaChartBar className="me-2" />
            )}
            {loading ? "Generating..." : "Generate Report"}
          </Button>

          <Button
            variant="outline-secondary"
            size="lg"
            onClick={saveFiltersToReport}
            disabled={saving}
          >
            {saving ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <FaSave className="me-2" />
            )}
            {saving ? "Saving..." : "Save Filters"}
          </Button>
        </div>

        {/* Export Report Modal */}
        <ExportReport
          showModal={showExportModal}
          setShowModal={setShowExportModal}
          reportData={reportData}
          availableFields={availableFields}
        />
      </Container>
      <ToastContainer />
    </>
  );
}

export default ReportBuilder;
