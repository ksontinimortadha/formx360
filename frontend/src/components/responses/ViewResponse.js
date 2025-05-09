import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewResponse = () => {
  const { responseId } = useParams();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/responses/${responseId}`)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        console.error("Error fetching response", err);
      });
  }, [responseId]);

  if (!response) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>View Response</h2>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};

export default ViewResponse;
