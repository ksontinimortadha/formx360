import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FormSubmit = () => {
  const [formData, setFormData] = useState(null);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { formId } = useParams();

  // Fetch form data based on formId
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await axios.get(
          `https://formx360.onrender.com/forms/${formId}`
        );
        setFormData(form.data.form);
        console.log("form", form.data.form);
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

  // Handle form submission
 const handleSubmit = async (event) => {
   event.preventDefault();

   // Check if there are any responses
   if (responses.length === 0) {
     setError("Please fill out the form before submitting.");
     console.error("Validation Error: No responses provided.");
     return;
   }

   console.log("Submitting responses:", responses);
   console.log("Fetching form with ID:", formId);

   try {
     const response = await axios.post(
       `https://formx360.onrender.com/responses/${formId}`,
       { responses }
     );

     console.log("Server Response:", response.data);

     if (response.status === 201) {
       alert("Response submitted successfully!");
       setResponses([]); // Clear the form after submission
     }
   } catch (err) {
     console.error(
       "Submit Error:",
       err.response ? err.response.data : err.message
     );

     // Display more specific errors if available
     if (err.response && err.response.data && err.response.data.errors) {
       setError(
         `Error submitting the form: ${err.response.data.errors.join(", ")}`
       );
     } else {
       setError("Error submitting the form. Please try again.");
     }
   }
 };


  if (loading) return <div>Loading form...</div>;

  if (error) return <div>{error}</div>;

  // Ensure formData and formData.fields exist before attempting to map
  if (!formData || !Array.isArray(formData.fields)) {
    return <div>Form data is not available</div>;
  }

  return (
    <div className="form-container">
      <h2>{formData.title}</h2>
      <form onSubmit={handleSubmit}>
        {formData.fields.map((field) => (
          <div key={field._id} className="form-group">
            <label>{field.label}</label>
            {field.type === "text" || field.type === "textarea" ? (
              <input
                type="text"
                name={field.name}
                className={field.className}
                value={
                  responses.find((r) => r.field_id === field._id)?.value || ""
                }
                onChange={(e) => handleFieldChange(field._id, e.target.value)}
                required={field.required}
              />
            ) : field.type === "checkbox-group" ||
              field.type === "radio-group" ? (
              field.options.map((option) => (
                <div key={option.value}>
                  <input
                    type={
                      field.type === "checkbox-group" ? "checkbox" : "radio"
                    }
                    name={field.name}
                    value={option.value}
                    onChange={(e) =>
                      handleFieldChange(field._id, e.target.value)
                    }
                  />
                  <label>{option.label}</label>
                </div>
              ))
            ) : null}
            {field.required &&
              !responses.find((r) => r.field_id === field._id)?.value && (
                <span style={{ color: "red" }}>This field is required</span>
              )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormSubmit;
