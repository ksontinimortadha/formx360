import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewResponse = () => {
  const { responseId } = useParams();
  const [response, setResponse] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://formx360.onrender.com/responses/${responseId}`)
      .then((res) => {
        setResponse(res.data);
        setFormTitle(res.data.form_id?.title || "Form Response");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching response", err);
        setLoading(false);
      });
  }, [responseId]);

  if (loading) return <p className="text-center mt-5">Loading response...</p>;
  if (!response) return <p className="text-center mt-5">No response found.</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Your Response</h1>
      <div className="card shadow-sm p-4">
        {response.responses && response.responses.length > 0 ? (
          response.responses.map((item, index) => (
            <div key={index} className="mb-3">
              <strong>{item.field_name || item.field_id}:</strong>
              <div>
                {Array.isArray(item.value) ? item.value.join(", ") : item.value}
              </div>
            </div>
          ))
        ) : (
          <p>No responses submitted for this form.</p>
        )}
      </div>
    </div>
  );
};

export default ViewResponse;
