import React from "react";
import { Button } from "react-bootstrap";

function CustomForm({
  formTitle,
  setFormTitle,
  formDescription,
  setFormDescription,
  onBack,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="p-3">
      <h5 className="fw-bold mb-3">Create Your Custom Form</h5>
      <div className="mb-3">
        <label className="form-label">Form Title</label>
        <input
          type="text"
          className="form-control"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Enter title"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Form Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>
      <div className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" type="submit">
          Add Form
        </Button>
      </div>
    </form>
  );
}

export default CustomForm;
