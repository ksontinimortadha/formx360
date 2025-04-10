import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import logo from "/Users/ksontini/Desktop/formx360/frontend/src/images/logo.png";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token and email from URL
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    console.log("Token from URL: ", token);
    console.log("Email from URL: ", email);

    if (!token || !email) {
      setError("Invalid or expired reset link.");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send the token, email, and new password in the request body
      const response = await fetch(
        "https://formx360.onrender.com/users/reset-password", // Update with actual backend URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token, // JWT token from URL
            email: email, // User email from URL
            newPassword: password, // New password entered by user
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Something went wrong.");

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000); // Redirect to login page after success
    } catch (err) {
      setError(
        err.message || "An error occurred while resetting your password."
      );
    }
  };

  return (
    <section
      className="d-flex align-items-center justify-content-center position-relative"
      style={{ minHeight: "100vh", backgroundColor: "#28499A" }}
    >
      <Container>
        <Card
          className="shadow border-light"
          style={{ maxWidth: "600px", margin: "5px auto" }}
        >
          <Card.Header className="bg-white border-0 d-flex align-items-center">
            <Button
              variant="light"
              className="d-flex align-items-center"
              onClick={() => navigate("/")}
            >
              <FaArrowLeft className="me-2" /> Back
            </Button>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <img
                className="img-fluid mb-3"
                loading="lazy"
                src={logo}
                width="200"
                alt="FormX360"
              />
              <h2 className="h4">Set a New Password</h2>
              <p className="text-secondary small">
                Enter your new password and confirm it.
              </p>
            </div>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row className="gy-2">
                <Col xs={12}>
                  <Form.Group controlId="password">
                    <Form.Label>
                      New Password <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="confirmPassword">
                    <Form.Label>
                      Confirm Password <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Button variant="primary" type="submit" className="w-100">
                    Reset Password
                  </Button>
                </Col>
              </Row>
            </Form>

            <div className="text-center mt-4">
              <hr className="border-secondary-subtle" />
              <p className="text-secondary small">
                Back to login page?
                <span
                  className="text-primary text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Log In
                </span>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

export default ResetPassword;
