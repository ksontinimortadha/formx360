import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import FormChoice from "./FormChoice";
import CustomForm from "./CustomForm";
import TemplateSelector from "./TemplateSelector";
import TemplatePreview from "./TemplatePreview";
import "./AddFormModal.css";
import predefinedForms from "./formTemplates";



function AddFormModal({ show, handleClose, fetchForms, companyId }) {
  const [mode, setMode] = useState(null); // null | "custom" | "template"
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const token = localStorage.getItem("token");
  const [formFields, setFormFields] = useState([]);

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setMode(null);
  };

  const handleSubmit = async (e, template = null) => {
    e.preventDefault();

    const title = template ? template.title : formTitle;
    const description = template ? template.description : formDescription;
    // Fix here: If template, get its fields; else get fields from form state (e.g. formFields)
    const fields = template ? template.fields || [] : formFields || [];

    console.log("fields", fields);
    if (!title || !description) {
      toast.error("Please provide both title and description.");
      return;
    }

    if (!token) {
      toast.error("You need to log in first.");
      return;
    }

    try {
      await axios.post(
        `https://formx360.onrender.com/forms/${companyId}/forms`,
        { title, description, fields }, // Send fields here too
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormFields(fields);
      toast.success("Form added successfully!");
      resetForm();
      handleClose();
      if (fetchForms) fetchForms();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to add form.");
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          resetForm();
          handleClose();
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mode === null && <FormChoice onSelect={setMode} />}
          {mode === "custom" && (
            <CustomForm
              formTitle={formTitle}
              setFormTitle={setFormTitle}
              formDescription={formDescription}
              setFormDescription={setFormDescription}
              onBack={resetForm}
              onSubmit={handleSubmit}
            />
          )}
          {mode === "template" && (
            <TemplateSelector
              templates={predefinedForms}
              onPreview={setPreviewTemplate}
              onSubmit={handleSubmit}
              onBack={resetForm}
              openPreview={() => setShowPreview(true)}
            />
          )}
        </Modal.Body>
      </Modal>

      <TemplatePreview
        show={showPreview}
        template={previewTemplate}
        onClose={() => setShowPreview(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default AddFormModal;
