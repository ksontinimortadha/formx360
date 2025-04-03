import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditCompanyModal({
  show,
  handleClose,
  companyDetails,
  setCompanyDetails,
  handleEditCompany,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="companyName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={companyDetails?.name || ""}
              onChange={(e) =>
                setCompanyDetails((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </Form.Group>
          <Form.Group controlId="industry">
            <Form.Label>Industry</Form.Label>
            <Form.Control
              type="text"
              value={companyDetails?.industry || ""}
              onChange={(e) =>
                setCompanyDetails((prev) => ({
                  ...prev,
                  industry: e.target.value,
                }))
              }
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={companyDetails?.description || ""}
              onChange={(e) =>
                setCompanyDetails((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleEditCompany}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditCompanyModal;
