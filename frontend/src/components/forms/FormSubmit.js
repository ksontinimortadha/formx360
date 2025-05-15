import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormSubmit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fieldStyles, setFieldStyles] = useState({});
  const [selectedTheme, setSelectedTheme] = useState(""); // Theme state
  const { formId } = useParams();

  // Use ref for form data to optimize performance
  const formDataRef = useRef(null);

  // Fetch form data based on formId
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await axios.get(
          `https://formx360.onrender.com/forms/${formId}`
        );
        setFormData(form.data.form);
        setFieldStyles(form.data.form.fieldStyles);
        setSelectedTheme(form.data.form.theme);
        formDataRef.current = form.data.form;
        setLoading(false);
      } catch (err) {
        setError("Error loading form.");
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  // Handle field changes
  const handleFieldChange = (fieldId, value) => {
    setResponses((prevResponses) => {
      const updatedResponses = prevResponses.filter(
        (response) => response.field_id !== fieldId
      );
      updatedResponses.push({ field_id: fieldId, value });
      return updatedResponses;
    });
  };

  // Validate required fields before submission
  const validateForm = () => {
    const requiredFields = formDataRef.current.fields.filter(
      (field) => field.required
    );
    for (const field of requiredFields) {
      const response = responses.find((r) => r.field_id === field._id);
      if (!response || !response.value) {
        toast.error(`Field "${field.label}" is required.`);
        return false;
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    // Check if there are any responses
    if (responses.length === 0) {
      toast.error("Please fill out the form before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        `https://formx360.onrender.com/responses/${formId}`,
        { responses }
      );
      const responseId = response.data.response._id;
      if (response.status === 201) {
        toast.success("Response submitted successfully!");
        navigate(`/responses/submission-success/${responseId}`);
        setResponses([]);
      }
    } catch (err) {
      console.error(
        "Submit Error:",
        err.response ? err.response.data : err.message
      );

      // Display more specific errors if available
      if (err.response && err.response.data && err.response.data.errors) {
        toast.error(
          `Error submitting the form: ${err.response.data.errors.join(", ")}`
        );
      } else {
        toast.error("Error submitting the form. Please try again.");
      }
    }
  };

  if (loading) return <div>Loading form...</div>;

  // Ensure formData and formData.fields exist before attempting to map
  if (!formData || !Array.isArray(formData.fields)) {
    return <div>Form data is not available</div>;
  }

  // Render fields and prefill them with existing responses
  const renderFormFields = () => {
    return formData.fields.map((field, index) => {
      const fieldStyle = fieldStyles[index] || {};
      const placementClass = fieldStyle.position
        ? `field-${fieldStyle.position}`
        : "";

      // Check if there's a response for the field
      const response = responses.find((r) => r.field_id === field._id);
      const prefilledValue = response ? response.value : "";

      const fieldContent = (
        <>
          {/* Render checkbox or radio group */}
          {field.type === "checkbox-group" || field.type === "radio-group" ? (
            <div style={{ marginBottom: "15px" }}>
              {field.label}

              {field.type === "checkbox-group" &&
                field.values.map((option, i) => (
                  <label
                    key={option.value || i}
                    style={{ marginRight: "10px" }}
                  >
                    <input
                      style={fieldStyle}
                      type="checkbox"
                      name={field.name}
                      value={option.value}
                      checked={prefilledValue.includes(option.value)} // Check if the value is in the array
                      onChange={(e) =>
                        handleFieldChange(
                          field._id,
                          e.target.value,
                          e.target.checked
                        )
                      } // Pass checked state to the handler
                    />
                    {option.label}
                  </label>
                ))}

              {field.type === "radio-group" &&
                field.values.map((option, i) => (
                  <label
                    key={option.value || i}
                    style={{ marginRight: "10px" }}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      checked={prefilledValue === option.value} // Single value for radio buttons
                      onChange={() =>
                        handleFieldChange(field._id, option.value)
                      } // Update state for radio button
                    />
                    {option.label}
                  </label>
                ))}
            </div>
          ) : field.type === "button" ? (
            <button
              type="button"
              style={{ ...fieldStyle, marginBottom: "15px" }}
              key={field.name || index}
              onClick={handleSubmit}
            >
              {field.label}
            </button>
          ) : field.type === "select" ? (
            <div style={{ marginBottom: "15px" }}>
              {field.label}
              <select
                style={{ ...fieldStyle, width: "100%" }}
                key={field.name || index}
                value={prefilledValue}
                onChange={(e) => handleFieldChange(field._id, e.target.value)}
              >
                {field.values &&
                  field.values.map((option, idx) => (
                    <option key={option.value || idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>
          ) : field.type === "textarea" ? (
            <div style={{ marginBottom: "15px" }}>
              {field.label}
              <textarea
                placeholder={field.placeholder || "Enter text"}
                style={{ ...fieldStyle, width: "100%", height: "100px" }}
                key={field.name || index}
                value={prefilledValue}
                onChange={(e) => handleFieldChange(field._id, e.target.value)}
              />
            </div>
          ) : field.type === "autocomplete" ? (
            <div style={{ marginBottom: "15px" }}>
              {field.label}
              <input
                type="text"
                placeholder={field.placeholder || "Start typing..."}
                list="autocomplete-list"
                style={fieldStyle}
                key={field.name || index}
                value={prefilledValue}
                onChange={(e) => handleFieldChange(field._id, e.target.value)}
              />
            </div>
          ) : field.type === "file" ? (
            <div style={{ marginBottom: "15px" }}>
              {field.label}
              <input type="file" style={fieldStyle} key={field.name || index} />
            </div>
          ) : field.type === "date" ? (
            <div style={{ marginBottom: "15px" }}>
              {field.label}
              <input
                type="date"
                style={fieldStyle}
                key={field.name || index}
                value={prefilledValue}
                onChange={(e) => handleFieldChange(field._id, e.target.value)}
              />
            </div>
          ) : field.type === "hidden" ? (
            <input
              type="hidden"
              value={field.value || ""}
              style={fieldStyle}
              key={field.name || index}
            />
          ) : field.type === "header" ? (
            <h2 key={field.name || index}>{field.label}</h2>
          ) : field.type === "paragraph" ? (
            <p key={field.name || index}>{field.label}</p>
          ) : (
            <div style={{ marginBottom: "15px" }}>
              {field.label}
              <input
                type={field.type}
                placeholder={field.placeholder || "Enter " + field.type}
                style={fieldStyle}
                key={field.name || index}
                value={prefilledValue}
                onChange={(e) => handleFieldChange(field._id, e.target.value)}
              />
            </div>
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
          key={field.name || index}
        >
          <div
            className={`form-field ${placementClass}`}
            style={{ marginBottom: "10px" }}
          >
            {fieldContent}
          </div>
        </div>
      );
    });
  };

  const styles = {
    container: {
      backgroundColor: "#f9f9f9",
      padding: "20px",
      borderRadius: "15px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      margin: "20px auto",
    },
    title: {
      fontSize: "24px",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
    },
  };
  const handleBackToDashboard = () => {
    navigate("/user-dashboard"); 
  };
  return (
    <>
      {formData.privateUrl && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 10,
          }}
        >
          <button
            onClick={handleBackToDashboard}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 14px",
              borderRadius: "8px",
              backgroundColor: "#f0f4ff",
              color: "#1a73e8",
              border: "1px solid #1a73e8",
              fontWeight: "500",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#1a73e8";
              e.target.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#f0f4ff";
              e.target.style.color = "#1a73e8";
            }}
          >
            <span style={{ fontSize: "18px" }}>←</span> Back to Dashboard
          </button>
        </div>
      )}

      <div style={{ ...styles.container, position: "relative" }}>
        <h1 style={styles.title}>{formData.title}</h1>

        <form
          onSubmit={handleSubmit}
          className={`${selectedTheme}`}
          style={{ paddingTop: "10px" }}
        >
          {renderFormFields()}
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default FormSubmit;
