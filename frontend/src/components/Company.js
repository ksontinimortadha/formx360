import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Navbar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/logo.png";

function CompanyPage() {
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Retrieve user ID from sessionStorage
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Retrieve user ID from sessionStorage
    const userId = sessionStorage.getItem("userId");

    const generateCompanyId = () => {
      const randomId = Math.random().toString(36).substring(2, 15); 
      return `${randomId}`;
    };

    const companyId = generateCompanyId();
    // Simple validation for form fields
    if (!companyName || !industry || !companyId) {
      setErrorMessage("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Check if userId is available
    if (!userId) {
      setErrorMessage("User not logged in. Please log in and try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://formx360.onrender.com/companies/company",
        {
          id: companyId, // Include the company ID
          name: companyName,
          industry,
          description,
          userId,
        }
      );

      const newCompany = response.data.company;

      // Save company ID to session storage and redirect to dashboard
      sessionStorage.setItem("companyId", newCompany._id);
      navigate(`/dashboard?companyId=${newCompany._id}`);
    } catch (error) {
      // Handle errors and display appropriate message
      setErrorMessage(
        error.response?.data?.error ||
          "Failed to create the company. Please try again."
      );
      console.error("Error creating company: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation Bar */}
      <Navbar bg="light" className="shadow-sm py-2">
        <Container>
          <Navbar.Brand>
            <img
              src={logo}
              width="130"
              height="20"
              alt="FormX360"
              style={{ margin: "10px" }}
            />
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Company Creation Form */}
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={6}>
            <h3 className="text-center mb-4">Create Your Company</h3>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleFormSubmit}>
              <Form.Group className="mb-3" controlId="formCompanyName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formIndustry">
                <Form.Label>Industry</Form.Label>
                <Form.Control
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Enter industry"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a short description"
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Company"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CompanyPage;
