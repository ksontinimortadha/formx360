import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditResponse = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://formx360.onrender.com/responses/${responseId}`)
      .then((res) => {
        setFormTitle(res.data.form_id?.title || "Edit Response");
        setResponses(res.data.responses || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching response", err);
        setLoading(false);
      });
  }, [responseId]);

  const handleChange = (index, value) => {
    setResponses((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://formx360.onrender.com/responses/${responseId}`, {
        responses,
      });
      navigate(`/view-response/${responseId}`);
    } catch (error) {
      console.error("Error updating response", error);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Update your Response</h1>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {responses.length > 0 ? (
          responses.map((item, index) => (
            <div className="mb-3" key={item.field_id || index}>
              <label className="form-label">
                {item.field_name || item.field_id}
              </label>
              <input
                type="text"
                className="form-control"
                value={
                  Array.isArray(item.value) ? item.value.join(", ") : item.value
                }
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          ))
        ) : (
          <p>No fields to edit.</p>
        )}
        <button type="submit" className="btn btn-primary">
          Update Response
        </button>
      </form>
    </div>
  );
};

export default EditResponse;
