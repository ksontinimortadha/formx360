import React from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

function DeleteFormModal({ show, handleClose, formToEdit, fetchForms }) {
  const handleDeleteForm = async () => {
    if (!formToEdit) return;
    try {
      await axios.delete(
        `https://formx360.onrender.com/forms/${formToEdit._id}`
      );
      toast.success("Form deleted successfully.");
      fetchForms(formToEdit.companyId);
      handleClose();
    } catch (error) {
      toast.error("Failed to delete form.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the form "{formToEdit?.title}"?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteForm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteFormModal;
