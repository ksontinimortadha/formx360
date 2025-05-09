import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditResponse = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios
      .get(`/api/responses/${responseId}`)
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching response", err);
      });
  }, [responseId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`/api/responses/${responseId}`, formData);
    navigate(`/view-response/${responseId}`);
  };

  return (
    <div className="container mt-5">
      <h2>Edit Response</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map(
          (key) =>
            key !== "_id" && (
              <div className="mb-3" key={key}>
                <label className="form-label">{key}</label>
                <input
                  type="text"
                  className="form-control"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                />
              </div>
            )
        )}
        <button type="submit" className="btn btn-primary">
          Update Response
        </button>
      </form>
    </div>
  );
};

export default EditResponse;
