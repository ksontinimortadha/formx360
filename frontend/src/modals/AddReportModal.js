import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

function AddReportModal({ show, handleClose }) {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    const storedCompanyId = sessionStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
      fetchForms(storedCompanyId);
    }
  }, []);

  const fetchForms = async (companyId) => {
    if (!companyId) return;
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/forms/${companyId}/forms`
      );
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Failed to fetch forms.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Form:", selectedForm);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Report Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter report title"
              required
            />
          </Form.Group>

          <Form.Group controlId="formSelect" className="mt-3">
            <Form.Label>Select Form</Form.Label>
            <Form.Select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              required
            >
              <option value="">Choose a form</option>
              {forms.map((form) => (
                <option key={form._id} value={form._id}>
                  {form.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Report
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddReportModal;
