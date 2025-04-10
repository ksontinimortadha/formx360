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
  Table,
  Modal,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaTrash,
  FaFilter,
  FaChartBar,
  FaArrowLeft,
} from "react-icons/fa";
import NavbarComponent from "../NavbarComponent";

function ReportBuilder() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [filters, setFilters] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  // Fetch the report details
  const fetchReport = async () => {
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/reports/report/${reportId}`
      );
      setReport(response.data);
      // Fetch form details only if formId exists
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
    console.log(filters);
    try {
      const response = await axios.post(
        `https://formx360.onrender.com/reports/report/${reportId}/filter`,
        { filters }
      );
      setReportData(response.data);
      // Log each responses array individually
      response.data.forEach((entry, index) => {
        console.log(`Responses for entry ${index + 1}:`, entry.responses);
      });
      setShowModal(true);
      toast.success("success");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <Container fluid className="p-4">
        <FaArrowLeft
          style={{ marginLeft: "20px", marginTop: "20px" }}
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

        {/* Generate Report Button */}
        <div className="text-center mt-4">
          <Button
            variant="success"
            size="lg"
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? (
              "Generating..."
            ) : (
              <>
                <FaChartBar className="me-2" /> Generate Report
              </>
            )}
          </Button>
        </div>

        {/* Report Data Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Report Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {reportData.length > 0 ? (
              <Table striped bordered hover responsive className="shadow-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    {reportData[0].responses.map((response, index) => (
                      <th key={index}>{response.field_name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((entry, rowIndex) => (
                    <tr key={rowIndex}>
                      {entry.responses.map((response, colIndex) => (
                        <td key={colIndex}>{response.value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No data found based on your filters.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default ReportBuilder;
