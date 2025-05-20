import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import FormChoice from "./FormChoice";
import CustomForm from "./CustomForm";
import TemplateSelector from "./TemplateSelector";
import TemplatePreview from "./TemplatePreview";
import "./AddFormModal.css";

const predefinedForms = [
  {
    title: "Employee Feedback",
    description:
      "Gather insights from your employees regarding workplace satisfaction.",
    fields: [
      {
        id: "q1",
        name: "q1",
        label: "How satisfied are you with your current role?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Very Satisfied", value: "Very Satisfied", selected: false },
          { label: "Satisfied", value: "Satisfied", selected: false },
          { label: "Neutral", value: "Neutral", selected: false },
          { label: "Dissatisfied", value: "Dissatisfied", selected: false },
          {
            label: "Very Dissatisfied",
            value: "Very Dissatisfied",
            selected: false,
          },
        ],
      },
      {
        id: "q2",
        name: "q2",
        label: "What do you like most about working here?",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q3",
        name: "q3",
        label: "Any suggestions for improvement?",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q4",
        name: "q4",
        label: "Would you recommend this company to a friend?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Yes", value: "Yes", selected: false },
          { label: "No", value: "No", selected: false },
          { label: "Maybe", value: "Maybe", selected: false },
        ],
      },
    ],
  },

  {
    title: "Customer Satisfaction",
    description:
      "Understand your customers' experience with your products or services.",
    fields: [
      {
        id: "q1",
        name: "q1",
        label: "How would you rate our product/service?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Excellent", value: "Excellent", selected: false },
          { label: "Good", value: "Good", selected: false },
          { label: "Average", value: "Average", selected: false },
          { label: "Poor", value: "Poor", selected: false },
          { label: "Very Poor", value: "Very Poor", selected: false },
        ],
      },
      {
        id: "q2",
        name: "q2",
        label: "What feature do you like the most?",
        type: "text",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q3",
        name: "q3",
        label: "What issues have you faced (if any)?",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q4",
        name: "q4",
        label: "How likely are you to recommend us?",
        type: "select",
        className: "form-control",
        required: true,
        options: [
          { label: "Very Likely", value: "Very Likely", selected: false },
          { label: "Likely", value: "Likely", selected: false },
          { label: "Neutral", value: "Neutral", selected: false },
          { label: "Unlikely", value: "Unlikely", selected: false },
          { label: "Very Unlikely", value: "Very Unlikely", selected: false },
        ],
      },
    ],
  },

  {
    title: "IT Support Request",
    description:
      "Streamline technical issue reporting with this structured form.",
    fields: [
      {
        id: "q1",
        name: "q1",
        label: "Your Name",
        type: "text",
        className: "form-control",
        required: true,
        options: [],
      },
      {
        id: "q2",
        name: "q2",
        label: "Department",
        type: "select",
        className: "form-control",
        required: true,
        options: [
          { label: "IT", value: "IT", selected: false },
          { label: "HR", value: "HR", selected: false },
          { label: "Sales", value: "Sales", selected: false },
          { label: "Marketing", value: "Marketing", selected: false },
          { label: "Finance", value: "Finance", selected: false },
          { label: "Other", value: "Other", selected: false },
        ],
      },
      {
        id: "q3",
        name: "q3",
        label: "Type of Issue",
        type: "select",
        className: "form-control",
        required: true,
        options: [
          { label: "Hardware", value: "Hardware", selected: false },
          { label: "Software", value: "Software", selected: false },
          { label: "Network", value: "Network", selected: false },
          { label: "Access", value: "Access", selected: false },
          { label: "Other", value: "Other", selected: false },
        ],
      },
      {
        id: "q4",
        name: "q4",
        label: "Description of the issue",
        type: "textarea",
        className: "form-control",
        required: true,
        options: [],
      },
      {
        id: "q5",
        name: "q5",
        label: "Urgency Level",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Low", value: "Low", selected: false },
          { label: "Medium", value: "Medium", selected: false },
          { label: "High", value: "High", selected: false },
          { label: "Critical", value: "Critical", selected: false },
        ],
      },
    ],
  },

  {
    title: "Project Evaluation",
    description:
      "Evaluate completed projects based on performance and outcomes.",
    fields: [
      {
        id: "q1",
        name: "q1",
        label: "Project Name",
        type: "text",
        className: "form-control",
        required: true,
        options: [],
      },
      {
        id: "q2",
        name: "q2",
        label: "Overall project success",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          {
            label: "Very Successful",
            value: "Very Successful",
            selected: false,
          },
          { label: "Successful", value: "Successful", selected: false },
          { label: "Neutral", value: "Neutral", selected: false },
          { label: "Unsuccessful", value: "Unsuccessful", selected: false },
          {
            label: "Very Unsuccessful",
            value: "Very Unsuccessful",
            selected: false,
          },
        ],
      },
      {
        id: "q3",
        name: "q3",
        label: "Key achievements",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q4",
        name: "q4",
        label: "Areas for improvement",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q5",
        name: "q5",
        label: "Would you work on a similar project again?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Yes", value: "Yes", selected: false },
          { label: "No", value: "No", selected: false },
          { label: "Maybe", value: "Maybe", selected: false },
        ],
      },
    ],
  },
];

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
