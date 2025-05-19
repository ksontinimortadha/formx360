import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import {
  FaChartLine,
  FaUsers,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import LineChart from "../charts/LineChart";
import BarChart from "../charts/BarCharts";
import StatCard from "../charts/StatCard";
import PieChart from "../charts/PieChart";
import RadarChart from "../charts/RadarChart";
import ConversionRateChart from "../charts/ConversionRateChart";

import { useParams } from "react-router-dom";

// --- UTILITIES ---

// --- FILTERING UTILS ---

function applyFilters(responses, filters) {
  return responses.filter((resp) => {
    // Filter by date range (assuming resp has a date field or createdAt)
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      const respDate = new Date(resp.createdAt || resp.date || Date.now());
      if (respDate < startDate) return false;
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      const respDate = new Date(resp.createdAt || resp.date || Date.now());
      if (respDate > endDate) return false;
    }

    // Filter by value filters (simple equal match)
    for (const [field, filterValue] of Object.entries(
      filters.valueFilters || {}
    )) {
      if (!filterValue) continue;
      const fieldResp = resp.responses.find((f) => f.field_name === field);
      if (!fieldResp) return false;
      // If filterValue is a comma separated list, allow matching any of those
      const allowedValues = filterValue.split(",").map((v) => v.trim());
      if (!allowedValues.includes(fieldResp.value)) return false;
    }

    return true;
  });
}

// --- Chart rendering based on config ---

function renderChart(config, responses) {
  const { chartType, fields, filters } = config;

  const filteredResponses = applyFilters(responses, filters || {});

  if (filteredResponses.length === 0) {
    return <div>No data after applying filters.</div>;
  }

  if (chartType === "Radar") {
    if (!fields.length) return <div>No fields selected for Radar chart.</div>;

    // For Radar: calculate normalized average for each field
    const data = fields.map((field) => {
      const values = filteredResponses
        .map((r) => {
          const f = r.responses.find((resp) => resp.field_name === field);
          return f ? Number(f.value) : null;
        })
        .filter((v) => v !== null && !isNaN(v));

      if (values.length === 0) return { label: field, normalizedValue: 0 };

      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const max = Math.max(...values);

      return {
        label: field,
        normalizedValue: max === 0 ? 0 : avg / max,
      };
    });

    return <RadarChart data={data} />;
  }

  if (fields.length === 0) return <div>Select at least one field.</div>;

  // For single field charts, only take the first field
  const field = fields[0];

  const values = filteredResponses
    .map((r) => {
      const f = r.responses.find((resp) => resp.field_name === field);
      return f ? f.value : null;
    })
    .filter((v) => v !== null);

  if (values.length === 0) {
    return <div>No data for field "{field}"</div>;
  }

  if (chartType === "Pie" || chartType === "Bar") {
    const counts = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    const labels = Object.keys(counts);
    const data = labels.map((l) => counts[l]);

    if (chartType === "Pie") {
      const pieData = labels.map((label) => ({
        label,
        value: counts[label],
      }));
      return <PieChart data={pieData} />;
    }

    if (chartType === "Bar") {
      return <BarChart labels={labels} data={data} />;
    }
  }

  if (chartType === "Line") {
    const numericValues = values
      .map((v) => {
        const n = Number(v);
        return isNaN(n) ? null : n;
      })
      .filter((v) => v !== null);

    if (numericValues.length === values.length) {
      const labels = values.map((_, i) => `#${i + 1}`);
      return <LineChart labels={labels} data={numericValues} />;
    } else {
      const counts = values.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      const labels = Object.keys(counts);
      const data = labels.map((l) => counts[l]);
      return <BarChart labels={labels} data={data} />;
    }
  }

  if (chartType === "ConversionRate") {
    const totalVisited = filteredResponses.length;
    const signedUp = filteredResponses.filter((r) =>
      r.responses.some(
        (f) => f.field_name === "Signed Up" && f.value === "true"
      )
    ).length;
    const purchased = filteredResponses.filter((r) =>
      r.responses.some(
        (f) => f.field_name === "Purchased" && f.value === "true"
      )
    ).length;

    return (
      <ConversionRateChart
        stages={["Visited", "Signed Up", "Purchased"]}
        counts={[totalVisited, signedUp, purchased]}
      />
    );
  }

  return <div>Chart type "{chartType}" not supported.</div>;
}

// --- Chart Builder Modal for Add/Edit ---

function ChartBuilderModal({
  show,
  onHide,
  fields,
  onSave,
  initialConfig = null,
}) {
  // Chart type options
  const chartTypes = [
    { label: "Line Chart", value: "Line" },
    { label: "Bar Chart", value: "Bar" },
    { label: "Pie Chart", value: "Pie" },
    { label: "Radar Chart", value: "Radar" },
    { label: "Conversion Rate Chart", value: "ConversionRate" },
  ];

  const [chartType, setChartType] = useState(
    initialConfig?.chartType || "Line"
  );
  // Fields selected: multiple for Radar, one for others
  const [selectedFields, setSelectedFields] = useState(
    initialConfig?.fields || (chartType === "Radar" ? [] : [fields[0] || ""])
  );

  // Filters state
  const [filters, setFilters] = useState(
    initialConfig?.filters || {
      startDate: "",
      endDate: "",
      valueFilters: {},
    }
  );

  // Handle field selection changes
  function handleFieldChange(e) {
    const value = e.target.value;
    if (chartType === "Radar") {
      // Multi-select handling
      const options = e.target.options;
      const selected = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selected.push(options[i].value);
      }
      setSelectedFields(selected);
    } else {
      setSelectedFields([value]);
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    if (name === "startDate" || name === "endDate") {
      setFilters((f) => ({ ...f, [name]: value }));
    } else {
      // valueFilters
      setFilters((f) => ({
        ...f,
        valueFilters: { ...f.valueFilters, [name]: value },
      }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      chartType === "Radar"
        ? selectedFields.length === 0
        : selectedFields[0] === "" || !selectedFields[0]
    ) {
      alert("Please select required field(s).");
      return;
    }
    onSave({
      chartType,
      fields: selectedFields,
      filters,
    });
    onHide();
  }

  // When chartType changes, reset fields appropriately
  useEffect(() => {
    if (chartType === "Radar") {
      setSelectedFields([]);
    } else {
      setSelectedFields([fields[0] || ""]);
    }
  }, [chartType, fields]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initialConfig ? "Edit" : "Add"} Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Chart Type</Form.Label>
            <Form.Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              {chartTypes.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              {chartType === "Radar"
                ? "Select Fields (multiple)"
                : "Select Field"}
            </Form.Label>
            <Form.Control
              as={chartType === "Radar" ? "select" : "select"}
              multiple={chartType === "Radar"}
              value={selectedFields}
              onChange={handleFieldChange}
              size={chartType === "Radar" ? 5 : 1}
            >
              {fields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Filters UI */}
          <hr />
          <h5>Select duration (optional)</h5>
          <Form.Group className="mb-3" controlId="filterStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="filterEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            <FaSave className="me-1" />
            Save Chart
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

// --- Main ReportDashboard ---

function ReportDashboard() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [charts, setCharts] = useState([]);

  // Modal control for add/edit
  const [modalShow, setModalShow] = useState(false);
  const [editingChartIndex, setEditingChartIndex] = useState(null);

  const { formId } = useParams();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `https://formx360.onrender.com/responses/form/${formId}`
        );
        setResponses(res.data || []);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [formId]);
  // Load charts from backend
 
  useEffect(() => {
    async function fetchCharts() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://formx360.onrender.com/report-dashboard/get",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(response.data.charts)) {
          setCharts(response.data.charts);
        } else {
          console.warn("Unexpected response format:", response.data);
        }
      } catch (err) {
        console.error("Failed to fetch charts", err);
        setError("Failed to load saved charts.");
      } finally {
        setLoading(false);
      }
    }

    fetchCharts();
  }, []);
  
  // Save charts on update
  useEffect(() => {
    if (charts.length === 0) return;

    async function saveCharts() {
      try {
        const token = localStorage.getItem("token"); // or sessionStorage.getItem(...)
        await axios.post(
          "https://formx360.onrender.com/report-dashboard/save",
          { charts },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Failed to save charts", err);
      }
    }

    saveCharts();
  }, [charts]);
  

  const fields = Array.from(
    new Set(responses.flatMap((r) => r.responses.map((f) => f.field_name)))
  );

  // Open modal to add chart
  function openAddModal() {
    setEditingChartIndex(null);
    setModalShow(true);
  }

  // Open modal to edit chart
  function openEditModal(index) {
    setEditingChartIndex(index);
    setModalShow(true);
  }

  // Save new or edited chart config
  function handleSaveChart(config) {
    if (editingChartIndex !== null) {
      setCharts((prev) =>
        prev.map((c, i) => (i === editingChartIndex ? config : c))
      );
    } else {
      setCharts((prev) => [...prev, config]);
    }
  }

  // Remove chart
  function handleRemoveChart(index) {
    if (window.confirm("Are you sure you want to remove this chart?")) {
      setCharts((prev) => prev.filter((_, i) => i !== index));
    }
  }

  const totalResponses = responses.length;

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4 text-center text-primary d-flex align-items-center justify-content-center gap-2">
        <FaChartLine size={28} />
        Report Statistics Dashboard
      </h2>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : totalResponses === 0 ? (
        <div className="text-center text-muted">No responses found.</div>
      ) : (
        <>
          <Row className="mb-3">
            <Col md={4}>
              <StatCard
                icon={FaUsers}
                label="Total Responses"
                value={totalResponses}
                color="#007bff"
              />
            </Col>
            <Col
              md={8}
              className="d-flex justify-content-end align-items-center"
            >
              <Button onClick={openAddModal} variant="success">
                + Add Chart
              </Button>
            </Col>
          </Row>

          <Row>
            {charts.length === 0 && (
              <p className="text-center text-muted">
                No charts created yet. Click "Add Chart" to start.
              </p>
            )}
            {charts.map((chart, idx) => (
              <Col key={idx} xs={12} md={6} lg={6} className="mb-4">
                <Card className="shadow-sm border-0">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-secondary text-white">
                    <h6 className="mb-0">
                      {chart.chartType} - {chart.fields.join(", ")}
                    </h6>
                    <div>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => openEditModal(idx)}
                        className="me-2"
                        title="Edit Chart"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveChart(idx)}
                        title="Remove Chart"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body className="d-flex justify-content-center">
                    {renderChart(chart, responses)}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
      <ChartBuilderModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        fields={fields}
        onSave={handleSaveChart}
        initialConfig={
          editingChartIndex !== null ? charts[editingChartIndex] : null
        }
      />
    </Container>
  );
}
export default ReportDashboard;
