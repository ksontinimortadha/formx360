import React from "react";
import { Modal, Button } from "react-bootstrap";

function DeleteCompanyModal({ show, handleClose, handleDeleteCompany }) {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this company?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteCompany}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteCompanyModal;
