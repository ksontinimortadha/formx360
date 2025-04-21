import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import logo from "./logo.png";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send login request
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (response.data?.user?.id) {
        // Store user data
        sessionStorage.setItem("userId", response.data.user.id);
        sessionStorage.setItem("token", response.data.token);
        localStorage.setItem("token", response.data.token);

        // Retrieve company ID
        const companyId = response.data.user.companyId;

        // Save companyId if available
        if (companyId) {
          sessionStorage.setItem("companyId", companyId);
          navigate(`/dashboard?companyId=${companyId}`);
        } else {
          navigate(`/companies/company`);
        }
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.request ? "No response from server" : "An error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
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
          <Card.Header className="bg-white border-0 d-flex justify-content-start">
            <Button
              variant="light"
              className="d-flex align-items-center"
              onClick={() => navigate("/")}
            >
              <FaArrowLeft className="me-2" />
            </Button>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="text-center mb-4" style={{ marginTop: "-45px" }}>
              <img
                className="img-fluid mb-3"
                loading="lazy"
                src={logo}
                width="200"
                alt="FormX360"
              />
              <h2 className="h4">Welcome Back!</h2>
              <p className="text-secondary small">
                Enter your credentials to access your account.
              </p>
            </div>
            <Form onSubmit={handleSubmit}>
              <Row className="gy-2">
                {error && (
                  <Col xs={12}>
                    <div className="alert alert-danger">{error}</div>
                  </Col>
                )}
                <Col xs={12}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        style={{ border: 0 }}
                        onClick={handleShowPassword}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} className="d-flex justify-content-end">
                  <span
                    className="text-primary text-decoration-none small"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/reset-password-request")}
                  >
                    Forgot Password?
                  </span>
                </Col>
                <Col xs={12}>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Col>
              </Row>
            </Form>
            <div className="text-center mt-4">
              <hr className="border-secondary-subtle" />
              <p className="text-secondary small">
                Don't have an account yet?
                <span
                  className="text-primary text-decoration-none"
                  style={{ cursor: "pointer", marginLeft: "2px" }}
                  onClick={() => navigate("/users/register")}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

export default Login;
