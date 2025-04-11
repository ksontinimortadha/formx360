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
  const publicUrl = `https://formx360.vercel.app/responses/public/${form._id}`;
  const privateUrl = `https://formx360.vercel.app/responses/${form._id}`;

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

        {newVisibility === "public" && (
          <Alert variant="info" style={{ wordWrap: "break-word" }}>
            This will make your form public. You will be able to share the
            following link with anyone:
            <br />
            <strong>{publicUrl}</strong>
          </Alert>
        )}

        {newVisibility === "private" && (
          <Alert variant="warning" style={{ wordWrap: "break-word" }}>
            This will restrict access to only selected users. The new private
            link will look like:
            <br />
            <strong>{privateUrl}</strong>
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
