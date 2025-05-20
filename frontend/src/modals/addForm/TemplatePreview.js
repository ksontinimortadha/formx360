import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function TemplatePreview({ show, onClose, template, onSubmit }) {
  if (!template) return null;

  const renderField = (field, idx) => {
    switch (field.type) {
      case "text":
        return (
          <Form.Group key={idx} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Enter ${field.label}`}
              disabled
            />
          </Form.Group>
        );
      case "textarea":
        return (
          <Form.Group key={idx} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={`Enter ${field.label}`}
              disabled
            />
          </Form.Group>
        );
      case "select":
        return (
          <Form.Group key={idx} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            <Form.Select disabled>
              <option value="">{`Select ${field.label}`}</option>
              {field.options?.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        );

      // Add other types if needed (checkbox, radio, etc.)
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>📋 Template Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="fw-semibold mb-3">{template.title}</h5>
        <p className="text-muted mb-4">{template.description}</p>

        {/* Render form fields preview */}
        <Form>
          {template.fields && template.fields.length > 0 ? (
            template.fields.map((field, idx) => renderField(field, idx))
          ) : (
            <p className="text-muted">No fields defined in this template.</p>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={(e) => {
            onSubmit(e, template);
            onClose();
          }}
        >
          Use This Template
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TemplatePreview;
