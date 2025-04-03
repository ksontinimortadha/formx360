import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

function RequestReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(
        "https://formx360.onrender.com/users/reset-password-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setMessage("A reset password link has been sent to your email.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
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
              <h2 className="h4">Reset Your Password</h2>
              <p className="text-secondary small">
                Enter your email, and we'll send you a reset link.
              </p>
            </div>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row className="gy-2">
                <Col xs={12}>
                  <Form.Group controlId="email">
                    <Form.Label>
                      Email Address <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Button variant="primary" type="submit" className="w-100">
                    Send Reset Link
                  </Button>
                </Col>
              </Row>
            </Form>

            <div className="text-center mt-4">
              <hr className="border-secondary-subtle" />
              <p className="text-secondary small">
                Remembered your password?
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

export default RequestReset;
