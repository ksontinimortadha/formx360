import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FormStylingPage.css";
import { useParams } from "react-router-dom";
import FormPreview from "./FormPreview";
import ThemeSelector from "./ThemeSelector";

const FormStylingPage = () => {
  const [formData, setFormData] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("Minialist-white");
  const [setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setSelectedField] = useState(null);
  const [fieldStyles] = useState({});
  const [setShowModal] = useState(false);
  const { formId } = useParams();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://form-x360-backend.vercel.app/forms/${formId}`
        );
        setFormData(response.data.form);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Error loading form. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFormData();
  }, [formId]);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme.className);
    setIsDropdownOpen(false);
  };

  const handleFieldClick = (fieldIndex) => {
    setSelectedField(fieldIndex);
    setShowModal(true);
  };

  const renderFormFields = () => {
    if (formData && formData.fields) {
      return formData.fields.map((field, index) => {
        const fieldStyle = fieldStyles[index] || {};
        const placementClass = fieldStyle.placement
          ? `field-${fieldStyle.placement}`
          : "";

        const fieldContent = (
          <>
            {/* Checkbox and Radio Group */}
            {field.type === "checkbox-group" || field.type === "radio-group" ? (
              <div>
                {field.label}
                {field.type === "checkbox-group" &&
                  field.values.map((option, i) => (
                    <label key={i}>
                      <input
                        type="checkbox"
                        name={field.name}
                        value={option.value}
                        onClick={() => handleFieldClick(index)}
                      />
                      {option.label}
                    </label>
                  ))}

                {field.type === "radio-group" &&
                  field.values.map((option, i) => (
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
                  {field.options &&
                    field.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option.value}
                      </option>
                    ))}
                </select>
              </>
            ) : field.type === "textarea" ? (
              <>
                {field.label}
                <textarea
                  placeholder={field.placeholder || field.label || "Enter text"}
                  style={fieldStyle}
                  onClick={() => handleFieldClick(index)}
                />
              </>
            ) : field.type === "autocomplete" ? (
              <>
                {field.label}
                <input
                  type="text"
                  placeholder={
                    field.placeholder || field.label || "Start typing..."
                  }
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
              <>
                {field.label}
                <input
                  type="hidden"
                  value={field.value || ""}
                  style={fieldStyle}
                />
              </>
            ) : field.type === "header" ? (
              <h2 onClick={() => handleFieldClick(index)}>{field.label}</h2>
            ) : field.type === "paragraph" ? (
              <p onClick={() => handleFieldClick(index)}>{field.label}</p>
            ) : (
              <>
                {field.label}
                <input
                  type={field.type}
                  placeholder={
                    field.placeholder || field.label || "Enter " + field.type
                  }
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

  return (
    <div className="form-styling-page">
      <h1 className="text-center">Style Your Form</h1>

      <div className="d-flex justify-content-between">
        {/* Left side: Form Preview */}
        <FormPreview
          selectedTheme={selectedTheme}
          loading={loading}
          error={error}
          renderFormFields={renderFormFields}
        />
        {/* Right side: Theme Selector */}
        <ThemeSelector
          selectedTheme={selectedTheme}
          onThemeChange={handleThemeChange}
        />
      </div>
    </div>
  );
};

export default FormStylingPage;
