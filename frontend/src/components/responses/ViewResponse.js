import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewResponse = () => {
  const { responseId } = useParams();
  const [response, setResponse] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const res = await axios.get(
          `https://formx360.onrender.com/responses/${responseId}`
        );
        setResponse(res.data);

        const formRes = await axios.get(
          `https://formx360.onrender.com/forms/${res.data.form_id._id}`
        );
        setForm(formRes.data.form);
      } catch (err) {
        console.error("Error fetching response", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [responseId]);

  if (loading) return <p className="text-center mt-5">Loading response...</p>;
  if (!response || !form)
    return <p className="text-center mt-5">No response found.</p>;

  return (
    <>
      <h1 className="mb-2 text-center">Your Response</h1>

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

        <form>
          {response.responses.map((item, index) => {
            const fieldIndex = form.fields.findIndex(
              (f) => f._id === item.field_id
            );
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
                    disabled
                    rows={3}
                  />
                ) : field.type === "checkbox" ? (
                  <div style={style}>
                    {Array.isArray(value)
                      ? value.map((val, idx) => (
                          <div key={idx}>
                            <input
                              type="checkbox"
                              checked
                              disabled
                              className="form-check-input me-2"
                            />
                            <label className="form-check-label">{val}</label>
                          </div>
                        ))
                      : null}
                  </div>
                ) : (
                  <input
                    type={field.type === "email" ? "email" : "text"}
                    className="form-control"
                    style={style}
                    value={value}
                    disabled
                  />
                )}
              </div>
            );
          })}
        </form>
      </div>
    </>
  );
};

export default ViewResponse;
