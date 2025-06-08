import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function TemplatePreview({ show, onClose, template, onSubmit }) {
  if (!template) return null;

  const renderField = (field, idx) => {
    switch (field.type) {
      case "text":
      case "email":
      case "url":
      case "tel":
      case "number":
        return (
          <Form.Group key={idx} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type={field.type}
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
              {(field.options || field.values || []).map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        );

      case "checkbox-group":
        return (
          <Form.Group key={idx} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            <div>
              {(field.options || field.values || []).map((opt, i) => (
                <Form.Check
                  key={i}
                  type="checkbox"
                  label={opt.label}
                  disabled
                  style={{ marginRight: "10px" }}
                />
              ))}
            </div>
          </Form.Group>
        );

      case "radio-group":
        return (
          <Form.Group key={idx} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            <div>
              {(field.options || field.values || []).map((opt, i) => (
                <Form.Check
                  key={i}
                  type="radio"
                  name={`radio-${idx}`}
                  label={opt.label}
                  disabled
                  style={{ marginRight: "10px" }}
                />
              ))}
            </div>
          </Form.Group>
        );

      case "date":
        return (
          <Form.Group key={idx} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            <Form.Control type="date" disabled />
          </Form.Group>
        );

      case "file":
        return (
          <Form.Group key={idx} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            <Form.Control type="file" disabled />
          </Form.Group>
        );

      case "hidden":
        return <Form.Control key={idx} type="hidden" disabled />;

      case "header":
        return (
          <h3 key={idx} className="mt-4 mb-2">
            {field.label}
          </h3>
        );

      case "paragraph":
        return (
          <p key={idx} className="text-muted">
            {field.label}
          </p>
        );

      case "button":
        return (
          <Form.Group key={idx} className="mb-3">
            <Form.Label visuallyHidden>{field.label}</Form.Label>
            <Form.Control
              type="button"
              value={field.label}
              disabled
              className="btn btn-secondary"
            />
          </Form.Group>
        );

      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title> Template Preview</Modal.Title>
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
