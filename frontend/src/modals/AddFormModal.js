import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

function AddFormModal({ show, handleClose, fetchForms, companyId }) {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const handleTitleChange = (e) => setFormTitle(e.target.value);
  const handleDescriptionChange = (e) => setFormDescription(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formTitle || !formDescription) {
      toast.error("Please provide both title and description.");
      return;
    }

    try {
      // Include the token in the Authorization header
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in first.");
        return;
      }

      const response = await axios.post(
        `https://formx360.onrender.com/forms/${companyId}/forms`,
        {
          title: formTitle,
          description: formDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Form added successfully!");
      handleClose();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to add form.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Form Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter form title"
              value={formTitle}
              onChange={handleTitleChange}
            />
          </Form.Group>

          <Form.Group controlId="formDescription" className="mt-3">
            <Form.Label>Form Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter form description"
              value={formDescription}
              onChange={handleDescriptionChange} // Handle description input
            />
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Form
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddFormModal;
