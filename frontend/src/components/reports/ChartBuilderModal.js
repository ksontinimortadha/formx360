import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { FaSave } from "react-icons/fa";

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
  ];

  const [chartType, setChartType] = useState(
    initialConfig?.chartType || "Line"
  );

  // Fields selected
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
    if (chartType === "Radar") {
      const options = e.target.options;
      const selected = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selected.push(options[i].value);
      }
      setSelectedFields(selected);
    } else {
      setSelectedFields([e.target.value]);
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

    onSave({
      chartType,
      fields: selectedFields,
      filters,
    });
    onHide();
  }

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
              as="select"
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

export default ChartBuilderModal;
