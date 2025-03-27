import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import NavbarComponent from "./NavbarComponent";
import Paginations from "./Paginations";
import { Button, Container, Navbar } from "react-bootstrap";
import {
  FaArrowLeft,
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
} from "react-icons/fa";

const ResponsePage = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

  // Fetch responses from the API
  const fetchResponses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/responses/form/${formId}`
      );

      if (response.data.length > 0) {
        // Extract unique field headers based on the responses
        const uniqueFields = [
          ...new Set(
            response.data.flatMap((res) => res.responses.map((r) => r.field_id))
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

  useEffect(() => {
    fetchResponses();
  }, [formId]);

  // Sorting logic
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedResponses = [...responses].sort((a, b) => {
      let aValue = "";
      let bValue = "";

      if (key === "submitted_at") {
        // Handle "Submitted At" date sorting
        aValue = new Date(a.submitted_at);
        bValue = new Date(b.submitted_at);
      } else {
        const aField = a.responses.find((res) => res.field_id === key);
        const bField = b.responses.find((res) => res.field_id === key);
        aValue = aField ? aField.value : "";
        bValue = bField ? bField.value : "";
      }

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setResponses(sortedResponses);
    setSortConfig({ key, direction });
  };

  // Paginate responses
  const indexOfLastResponse = currentPage * itemsPerPage;
  const indexOfFirstResponse = indexOfLastResponse - itemsPerPage;
  const currentResponses = responses.slice(
    indexOfFirstResponse,
    indexOfLastResponse
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-gray-500 mt-6">Loading responses...</p>
      </div>
    );
  }

  if (!responses.length) {
    return (
      <>
        <NavbarComponent />
        <Navbar className="bg-body-tertiary" style={{ marginBottom: "20px" }}>
          <Container>
            <Navbar.Brand style={{ fontWeight: "500" }}>
              <FaArrowLeft
                style={{ marginRight: "20px" }}
                size={20}
                color="darkgrey"
                onClick={() => navigate("/forms")}
              />
              Form Responses
            </Navbar.Brand>
            <Navbar.Toggle />
          </Container>
        </Navbar>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-center text-gray-500 mt-6">
            No responses found for this form.
          </p>
        </div>
      </>
    );
  }

  const handleBackClick = () => {
    navigate(`/forms`); // Navigate to the form page
  };
  return (
    <>
      <NavbarComponent />
      <Navbar className="bg-body-tertiary" style={{ marginBottom: "20px" }}>
        <Container>
          <Navbar.Brand style={{ fontWeight: "500" }}>
            <FaArrowLeft
              style={{ marginRight: "20px" }}
              size={20}
              color="darkgrey"
              onClick={handleBackClick}
            />
            Form Responses
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Export All
              </button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Table for displaying responses */}
      <table className="w-full table-auto" style={{ marginLeft: "35px" }}>
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {/* Render column headers dynamically based on field names */}
            {headers.map((fieldId) => {
              const field = responses[0]?.responses.find(
                (res) => res.field_id === fieldId
              );
              return (
                <th
                  key={fieldId}
                  className="border p-3 text-left cursor-pointer"
                >
                  {field ? field.field_name : "Unknown Field"}{" "}
                  {sortConfig.key === fieldId ? (
                    sortConfig.direction === "asc" ? (
                      <FaRegArrowAltCircleUp
                        onClick={() => requestSort(fieldId)}
                      />
                    ) : (
                      <FaRegArrowAltCircleDown
                        onClick={() => requestSort(fieldId)}
                      />
                    )
                  ) : (
                    <FaRegArrowAltCircleDown
                      onClick={() => requestSort(fieldId)}
                    />
                  )}
                </th>
              );
            })}
            <th
              className="border p-3 text-left cursor-pointer"
              onClick={() => requestSort("submitted_at")}
            >
              Submitted At{" "}
              {sortConfig.key === "submitted_at" ? (
                sortConfig.direction === "asc" ? (
                  <FaRegArrowAltCircleUp />
                ) : (
                  <FaRegArrowAltCircleDown />
                )
              ) : (
                <FaRegArrowAltCircleDown />
              )}
            </th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render responses dynamically */}
          {currentResponses.map((response) => (
            <tr
              key={response._id}
              className="border hover:bg-gray-50 transition-all"
            >
              {headers.map((fieldId) => {
                const field = response.responses.find(
                  (res) => res.field_id === fieldId
                );
                return (
                  <td key={fieldId} className="border p-3 text-gray-700">
                    {field ? field.value : "N/A"}
                  </td>
                );
              })}
              <td className="border p-3 text-gray-700">
                {new Date(response.submitted_at).toLocaleString()}
              </td>
              <td className="border p-3 text-gray-700">
                <Button variant="secondary">View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      {/**
       <Navbar className="bg-body-tertiary" fixed="bottom">
         <Container>
           <Navbar.Brand style={{ fontWeight: "bolder" }}></Navbar.Brand>
           <Navbar.Toggle />
           <Navbar.Collapse className="justify-content-end">
             <Navbar.Text>
               <Paginations
                 totalItems={responses.length}
                 itemsPerPage={itemsPerPage}
                 currentPage={currentPage}
                 setCurrentPage={setCurrentPage}
               />
             </Navbar.Text>
           </Navbar.Collapse>
         </Container>
       </Navbar>
       
       */}
    </>
  );
};

export default ResponsePage;
