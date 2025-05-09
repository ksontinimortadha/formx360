import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const EditResponseModal = ({
  show,
  onClose,
  onSave,
  editValues,
  headers,
  responses,
  onChange,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Response</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {headers.map((fieldId) => {
            const fieldName =
              responses[0]?.responses.find((res) => res.field_id === fieldId)
                ?.field_name || "Unknown Field";

            return (
              <Col md={6} key={fieldId}>
                <Form.Group className="mb-3">
                  <Form.Label>{fieldName}</Form.Label>
                  <Form.Control
                    type="text"
                    value={editValues[fieldId] || ""}
                    onChange={(e) => onChange(fieldId, e.target.value)}
                  />
                </Form.Group>
              </Col>
            );
          })}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditResponseModal;
