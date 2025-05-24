import React from "react";
import { Button, Form } from "react-bootstrap";

function CustomForm({
  formTitle,
  setFormTitle,
  setVisibility,
  visibility,
  formDescription,
  setFormDescription,
  onBack,
  onSubmit,
}) {
  return (
    <Form onSubmit={onSubmit} className="p-4" noValidate>
      <h5 className="fw-bold mb-4 text-center">Create Your Custom Form</h5>

      <Form.Group className="mb-4" controlId="formTitle">
        <Form.Label className="fw-semibold">
          Form Title <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter form title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          required
          aria-describedby="titleHelpBlock"
        />
        <Form.Text id="titleHelpBlock" muted>
          Give your form a clear and descriptive title.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-4" controlId="formDescription">
        <Form.Label className="fw-semibold">
          Form Description <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Describe the purpose of your form"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          required
          aria-describedby="descHelpBlock"
        />
        <Form.Text id="descHelpBlock" muted>
          Provide a brief description to help users understand the form.
        </Form.Text>
      </Form.Group>

      <fieldset className="mb-4">
        <legend className="fw-semibold mb-2">
          Form Visibility <span className="text-danger">*</span>
        </legend>
        <Form.Check
          inline
          type="radio"
          label="Public"
          name="visibility"
          id="visibilityPublic"
          value="public"
          checked={visibility === "public"}
          onChange={() => setVisibility("public")}
          aria-checked={visibility === "public"}
          required
        />
        <Form.Check
          inline
          type="radio"
          label="Private"
          name="visibility"
          id="visibilityPrivate"
          value="private"
          checked={visibility === "private"}
          onChange={() => setVisibility("private")}
          aria-checked={visibility === "private"}
        />
        <Form.Text muted>
          Public forms are accessible to everyone. Private forms are restricted.
        </Form.Text>
      </fieldset>

      <div className="d-flex justify-content-between mt-4">
        <Button
          variant="outline-secondary"
          onClick={onBack}
          aria-label="Go back to previous step"
        >
          ← Back
        </Button>
        <Button variant="primary" type="submit" aria-label="Submit the form">
          Add Form
        </Button>
      </div>
    </Form>
  );
}

export default CustomForm;
