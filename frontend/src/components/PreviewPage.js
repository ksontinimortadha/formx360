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
    if (formData && formData.fields) {
      return formData.fields.map((field, index) => {
        const fieldStyle = fieldStyles[index] || {};
        const placementClass = fieldStyle.position
          ? `field-${fieldStyle.position}`
          : "";

        const fieldContent = (
          <>
            {/* Render checkbox or radio group */}
            {field.type === "checkbox-group" || field.type === "radio-group" ? (
              <div style={{ marginBottom: "15px" }}>
                {field.label}
                {field.type === "checkbox-group" &&
                  field.values.map((option, i) => (
                    <label key={i} style={{ marginRight: "10px" }}>
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
                  field.values.map((option, i) => (
                    <label key={i} style={{ marginRight: "10px" }}>
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
              <button
                type="button"
                style={{ ...fieldStyle, marginBottom: "15px" }}
              >
                {field.label}
              </button>
            ) : field.type === "select" ? (
              <>
                <div style={{ marginBottom: "15px" }}>
                  {field.label}
                  <select style={{ ...fieldStyle, width: "100%" }}>
                    {field.options &&
                      field.options.map((option, idx) => (
                        <option key={idx} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </div>
              </>
            ) : field.type === "textarea" ? (
              <>
                <div style={{ marginBottom: "15px" }}>
                  {field.label}
                  <textarea
                    placeholder={field.placeholder || "Enter text"}
                    style={{ ...fieldStyle, width: "100%", height: "100px" }}
                  />
                </div>
              </>
            ) : field.type === "autocomplete" ? (
              <>
                <div style={{ marginBottom: "15px" }}>
                  {field.label}
                  <input
                    type="text"
                    placeholder={field.placeholder || "Start typing..."}
                    list="autocomplete-list"
                    style={fieldStyle}
                  />
                </div>
              </>
            ) : field.type === "file" ? (
              <>
                <div style={{ marginBottom: "15px" }}>
                  {field.label}
                  <input type="file" style={fieldStyle} />
                </div>
              </>
            ) : field.type === "date" ? (
              <>
                <div style={{ marginBottom: "15px" }}>
                  {field.label}
                  <input type="date" style={fieldStyle} />
                </div>
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
                <div style={{ marginBottom: "15px" }}>
                  {field.label}
                  <input
                    type={field.type}
                    placeholder={field.placeholder || "Enter " + field.type}
                    style={fieldStyle}
                  />
                </div>
              </>
            )}
          </>
        );

        return (
          <div
            className={`${selectedTheme}`}
            style={{
              paddingRight: "15px",
              paddingLeft: "15px",
            }}
          >
            <div
              key={index}
              className={`form-field ${placementClass}`}
              style={{ marginBottom: "10px" }} 
            >
              {fieldContent}
            </div>
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
