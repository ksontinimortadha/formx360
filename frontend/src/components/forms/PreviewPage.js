import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Spinner, Alert } from "react-bootstrap";

const PreviewPage = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formId } = useParams();
  const [fieldStyles, setFieldStyles] = useState({});
  const [selectedTheme, setSelectedTheme] = useState("");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://formx360.onrender.com/forms/${formId}`
        );
        setFormData(response.data.form);
        setFieldStyles(response.data.form.fieldStyles);
        setSelectedTheme(response.data.form.theme);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Error loading form. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

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
                      />
                      {option.label}
                    </label>
                  ))}
              </div>
            ) : field.type === "button" ? (
              <button type="button" style={fieldStyle}>
                {field.label}
              </button>
            ) : field.type === "select" ? (
              <>
                {field.label}
                <select style={fieldStyle}>
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
                />
              </>
            ) : field.type === "file" ? (
              <>
                {field.label}
                <input type="file" style={fieldStyle} />
              </>
            ) : field.type === "date" ? (
              <>
                {field.label}
                <input type="date" style={fieldStyle} />
              </>
            ) : field.type === "hidden" ? (
              <input
                type="hidden"
                value={field.value || ""}
                style={fieldStyle}
              />
            ) : field.type === "header" ? (
              <h2>{field.label}</h2>
            ) : field.type === "paragraph" ? (
              <p>{field.label}</p>
            ) : (
              <>
                {field.label}
                <input
                  type={field.type}
                  placeholder={field.placeholder || "Enter " + field.type}
                  style={fieldStyle}
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
    <div className="preview-page">
      <h1 className="text-center">Form Preview</h1>
      <Card>
        <Card.Body>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div className="form-preview-content">{renderFormFields()}</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PreviewPage;
