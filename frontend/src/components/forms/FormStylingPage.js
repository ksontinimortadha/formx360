import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FormStylingPage.css";
import { useNavigate, useParams } from "react-router-dom";
import FormPreview from "./FormPreview";
import ThemeSelector from "./ThemeSelector";
import EditStyleModal from "../../modals/EditStyleModal";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "react-bootstrap";

const FormStylingPage = () => {
  const [formData, setFormData] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("Minimalist-white");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [fieldStyles, setFieldStyles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { formId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://formx360.onrender.com/forms/${formId}`
        );
        setFormData(response.data.form);
        setSelectedTheme(response.data.form.theme);
        setFieldStyles(response.data.form.fieldStyles);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Error loading form. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFormData();
  }, [formId]);

  // Handle theme selection
  const handleThemeChange = (themeClassName) => {
    setSelectedTheme(themeClassName);
  };

  // Handle field click
  const handleFieldClick = (fieldIndex) => {
    setSelectedField(fieldIndex);
    setShowModal(true);
  };

  const handleStyleChange = (styleType, value) => {
    const updatedFieldStyles = { ...fieldStyles };
    updatedFieldStyles[selectedField] = {
      ...updatedFieldStyles[selectedField],
      [styleType]: value,
    };
    setFieldStyles(updatedFieldStyles);
  };

  // Render form fields dynamically
  const renderFormFields = () => {
    if (Array.isArray(formData?.fields)) {
      return formData.fields.map((field, index) => {
        const fieldStyle = fieldStyles[index] || {};
        const placementClass = fieldStyle.position
          ? `field-${fieldStyle.position}`
          : "";

        const fieldContent = (
          <>
            {field.type === "checkbox-group" || field.type === "radio-group" ? (
              <div>
                {field.label}
                {field.type === "checkbox-group" &&
                  field.values?.map((option, i) => (
                    <label key={i}>
                      <input
                        style={fieldStyle}
                        type="checkbox"
                        name={field.name}
                        value={option.value}
                        onClick={() => handleFieldClick(index)}
                      />
                      {option.label}
                    </label>
                  ))}
                {field.type === "radio-group" &&
                  field.values?.map((option, i) => (
                    <label key={i}>
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        onClick={() => handleFieldClick(index)}
                      />
                      {option.label}
                    </label>
                  ))}
              </div>
            ) : field.type === "button" ? (
              <button
                type="button"
                style={fieldStyle}
                onClick={() => handleFieldClick(index)}
              >
                {field.label}
              </button>
            ) : field.type === "select" ? (
              <>
                {field.label}
                <select
                  style={fieldStyle}
                  onClick={() => handleFieldClick(index)}
                >
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </>
            ) : field.type === "textarea" ? (
              <>
                {field.label}
                <textarea
                  placeholder={field.placeholder || "Enter text"}
                  style={fieldStyle}
                  onClick={() => handleFieldClick(index)}
                />
              </>
            ) : field.type === "autocomplete" ? (
              <>
                {field.label}
                <input
                  type="text"
                  placeholder={field.placeholder || "Start typing..."}
                  list="autocomplete-list"
                  style={fieldStyle}
                  onClick={() => handleFieldClick(index)}
                />
              </>
            ) : field.type === "file" ? (
              <>
                {field.label}
                <input
                  type="file"
                  style={fieldStyle}
                  onClick={() => handleFieldClick(index)}
                />
              </>
            ) : field.type === "date" ? (
              <>
                {field.label}
                <input
                  type="date"
                  style={fieldStyle}
                  onClick={() => handleFieldClick(index)}
                />
              </>
            ) : field.type === "hidden" ? (
              <input
                type="hidden"
                value={field.value || ""}
                style={fieldStyle}
              />
            ) : field.type === "header" ? (
              <h2 onClick={() => handleFieldClick(index)}>{field.label}</h2>
            ) : field.type === "paragraph" ? (
              <p onClick={() => handleFieldClick(index)}>{field.label}</p>
            ) : (
              <>
                {field.label}
                <input
                  type={field.type}
                  placeholder={field.placeholder || "Enter " + field.type}
                  style={fieldStyle}
                  onClick={() => handleFieldClick(index)}
                />
              </>
            )}
          </>
        );

        return (
          <div
            key={index}
            className={`form-field ${placementClass}`}
            style={fieldStyle}
          >
            {fieldContent}
          </div>
        );
      });
    }
    return null;
  };
  

  const handleBackButtonClick = () => {
    navigate(`/form-builder/${formData._id}`);
  };

  return (
    <div className="form-styling-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Button
            variant="outline-secondary"
            onClick={handleBackButtonClick}
            className="mr-3"
          >
            <FaArrowLeft className="mr-2" />
          </Button>
        </div>
        <h1
          className="text-center w-100 form-builder-title mx-auto"
          style={{ paddingTop: "15px", fontSize: "30px" }}
        >
          Style Your Form
        </h1>
        <div className="d-flex align-items-center">
          <Button
            size="sm"
            onClick={() => navigate(`/forms`)}
            className="next-step-btn mr-3"
            style={{ marginTop: "15px" }}
          >
            Back to Forms Dashboard
          </Button>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        {/* Left side: Form Preview */}
        <FormPreview
          selectedTheme={selectedTheme}
          fieldStyles={fieldStyles}
          loading={loading}
          error={error}
          renderFormFields={renderFormFields}
        />
        {/* Right side: Theme Selector */}
        <ThemeSelector onThemeChange={handleThemeChange} />
      </div>

      {/* Modal for Styling Control */}
      <EditStyleModal
        show={showModal}
        onHide={() => setShowModal(false)}
        fieldStyles={fieldStyles}
        selectedField={selectedField}
        formId={formId}
        handleStyleChange={handleStyleChange}
      />
    </div>
  );
};

export default FormStylingPage;
