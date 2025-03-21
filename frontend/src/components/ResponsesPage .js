import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResponsesPage = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(
          `https://formx360.onrender.com/responses/form/${formId}`
        );

        if (response.data.length > 0) {
          const uniqueFields = [
            ...new Set(
              response.data.flatMap((res) =>
                res.responses.map((r) => r.field_id)
              )
            ),
          ];
          setHeaders(uniqueFields);
        }
        console.log("res", response.data);
        setResponses(response.data);
      } catch (error) {
        console.error("Error fetching responses:", error);
        toast.error("Failed to fetch responses.");
      }
    };

    fetchResponses();
  }, [formId]);

  if (!responses.length)
    return (
      <p className="text-center text-gray-500 mt-6">
        No responses found for this form.
      </p>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Form Responses
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {/* Dynamically render headers from the field_name values */}
              {responses[0]?.responses.map((response) => (
                <th key={response.field_id} className="border p-3 text-left">
                  {response.field_name}
                </th>
              ))}
              <th className="border p-3 text-left">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr
                key={response._id}
                className="border hover:bg-gray-50 transition-all"
              >
                {/* Render the response values dynamically */}
                {response.responses.map((field) => (
                  <td key={field.field_id} className="border p-3 text-gray-700">
                    {field.value}
                  </td>
                ))}
                <td className="border p-3 text-gray-700">
                  {new Date(response.submitted_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsesPage;
