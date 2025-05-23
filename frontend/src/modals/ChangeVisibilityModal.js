import React, { useState } from "react";
import {
  Modal,
  Button,
  Alert,
  OverlayTrigger,
  Tooltip,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { FaCopy, FaLink, FaExchangeAlt, FaTimes } from "react-icons/fa";

function ChangeVisibilityModal({
  show,
  handleClose,
  form,
  handleVisibilityChange,
}) {
  const [showToast, setShowToast] = useState(false);

  if (!form) return null;

  const newVisibility = form.visibility === "public" ? "private" : "public";
  const publicUrl = `https://formx360.vercel.app/responses/public/${form._id}`;
  const privateUrl = `https://formx360.vercel.app/responses/private/${form._id}`;
  const currentUrl = form.visibility === "public" ? publicUrl : privateUrl;

  const handleToggleVisibility = async () => {
    await handleVisibilityChange(form);
    handleClose();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const renderCopyButton = (text) => (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Copy to clipboard</Tooltip>}
    >
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => copyToClipboard(text)}
        style={{ marginLeft: "10px" }}
        aria-label="Copy URL"
      >
        <FaCopy />
      </Button>
    </OverlayTrigger>
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Form Visibility</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Current visibility:</strong>{" "}
            <span className="text-capitalize">{form.visibility}</span>
            <br />
            <strong>Current link:</strong>
            <Alert
              variant="light"
              className="mt-2 d-flex align-items-center justify-content-between"
              style={{ wordBreak: "break-word" }}
            >
              <span style={{ flex: 1 }}>{currentUrl}</span>
              {renderCopyButton(currentUrl)}
            </Alert>
          </div>

          <div className="mb-3">
            <p>
              Click the button below to change visibility to{" "}
              <strong className={newVisibility}>{newVisibility}</strong>.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            <FaTimes className="me-2" />
            Close
          </Button>
          <Button variant="primary" onClick={handleToggleVisibility}>
            <FaExchangeAlt className="me-2" />
            Make {newVisibility}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide
        >
          <Toast.Body className="text-black">
            <FaLink style={{ marginRight: "5px" }} />
            Link copied to clipboard!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default ChangeVisibilityModal;
