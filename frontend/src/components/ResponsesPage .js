import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResponsesPage = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(
          `https://formx360.onrender.com/responses/forms/${formId}`
        );
        const data = await res.json();
        setResponses(data);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  if (loading) return <p>Loading responses...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Form Responses</h2>
      {responses.length === 0 ? (
        <p>No responses found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {Object.keys(responses[0]).map((key) => (
                <th key={key} className="border p-2 text-left">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((response, index) => (
              <tr key={index} className="border">
                {Object.values(response).map((value, i) => (
                  <td key={i} className="border p-2">
                    {String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResponsesPage;
