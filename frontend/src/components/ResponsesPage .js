import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResponsesPage = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      if (!formId) return;

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

        setResponses(response.data);
      } catch (error) {
        console.error("Error fetching responses:", error);
        toast.error("Failed to fetch responses.");
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  /**if (loading)
    return (
      <div className="flex justify-center items-center h-80">
        <ClipLoader size={50} color="#2563EB" />
      </div>
    ); */

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
              <th className="border p-3 text-left">Submitted At</th>
              {headers.map((header) => (
                <th key={header} className="border p-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr
                key={response._id}
                className="border hover:bg-gray-50 transition-all"
              >
                <td className="border p-3 text-gray-700">
                  {new Date(response.submitted_at).toLocaleString()}
                </td>
                {headers.map((header) => {
                  const field = response.responses.find(
                    (r) => r.field_id === header
                  );
                  return (
                    <td key={header} className="border p-3 text-gray-700">
                      {field ? field.value : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsesPage;
