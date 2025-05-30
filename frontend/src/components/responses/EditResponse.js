import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const EditResponse = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const res = await axios.get(
          `https://formx360.onrender.com/responses/get/${responseId}`
        );
        setResponse(res.data);
        const formRes = await axios.get(
          `https://formx360.onrender.com/forms/${res.data.form_id._id}`
        );
        setForm(formRes.data.form);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [responseId]);

  const handleChange = (index, value) => {
    setResponse((prev) => {
      const updatedResponses = prev.responses.map((item, i) =>
        i === index ? { ...item, value } : item
      );
      return { ...prev, responses: updatedResponses };
    });
  };

  const handleCheckboxChange = (index, val) => {
    setResponse((prev) => {
      const updatedResponses = prev.responses.map((item, i) => {
        if (i !== index) return item;
        const newValue = Array.isArray(item.value) ? [...item.value] : [];
        const exists = newValue.includes(val);
        return {
          ...item,
          value: exists
            ? newValue.filter((v) => v !== val)
            : [...newValue, val],
        };
      });
      return { ...prev, responses: updatedResponses };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://formx360.onrender.com/responses/${responseId}`, {
        responses: response.responses, 
      });
      navigate(`/responses/submission-success/${responseId}`);
    } catch (error) {
      console.error("Error updating response", error);
    }
  };
  const handleBackToDashboard = () => {
    navigate(`/responses/submission-success/${responseId}`);
  };
  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!form) return <p className="text-center mt-5">Form not found.</p>;

  return (
    <>
    <div
            style={{
              position: "absolute",
              top: "30px",
              left: "360px",
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
              <FaArrowLeft/> 
            </button>
          </div>
      <h1 className="mb-4 text-center" style={{ marginTop: "20px" }}>
        Update Your Response
      </h1>

      <div
        className={`container mt-5 ${form.theme || ""}`}
        style={{
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          margin: "20px auto",
        }}
      >
        <h2 className="mb-4 text-center">{form.title}</h2>

        <form onSubmit={handleSubmit}>
          {response.responses?.map((item, index) => {
            const fieldIndex = form.fields.findIndex(
              (f) => f._id === item.field_id
            );
            if (fieldIndex === -1) return null;

            const field = form.fields[fieldIndex];
            const style = form.fieldStyles?.[fieldIndex] || {};
            const value = item.value;

            return (
              <div className="mb-4" key={index}>
                <label className="form-label fw-bold">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    className="form-control"
                    style={style}
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    rows={3}
                  />
                ) : field.type === "checkbox" ? (
                  <div style={style}>
                    {field.options?.map((option, optIdx) => (
                      <div key={optIdx}>
                        <input
                          type="checkbox"
                          checked={
                            Array.isArray(value) && value.includes(option)
                          }
                          onChange={() => handleCheckboxChange(index, option)}
                          className="form-check-input me-2"
                        />
                        <label className="form-check-label">{option}</label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type === "email" ? "email" : "text"}
                    className="form-control"
                    style={style}
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                )}
              </div>
            );
          })}

          <button type="submit" className="btn btn-primary w-100">
            Update Response
          </button>
        </form>
      </div>
    </>
  );
};

export default EditResponse;
