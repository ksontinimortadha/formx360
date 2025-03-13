import React from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

function ChangeVisibilityModal({
  show,
  handleClose,
  form,
  handleVisibilityChange,
}) {
  if (!form) return null; 

  const newVisibility = form.visibility === "public" ? "private" : "public";
  const publicUrl =
    newVisibility === "public"
      ? `https://formx360.vercel.app/form/response/${form._id}`
      : null;

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
        {newVisibility === "public" && publicUrl && (
          <Alert variant="success">
            The form is now public! You can share the following link to allow
            users to access and submit the form:
            <br />
            <strong>{publicUrl}</strong>
          </Alert>
        )}
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
