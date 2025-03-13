import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

function ChangeVisibilityModal({
  show,
  handleClose,
  form,
  handleVisibilityChange,
}) {
  if (!form) return null; 

  const newVisibility = form.visibility === "public" ? "private" : "public";

  const handleConfirmChange = async () => {
    await handleVisibilityChange(form); 
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Visibility</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to change the visibility of the form{" "}
          <strong>{form.title}</strong> to <strong>{newVisibility}</strong>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FaTimes /> Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirmChange}>
          <FaCheck /> Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ChangeVisibilityModal;
