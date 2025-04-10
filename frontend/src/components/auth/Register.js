import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import logo from "/Users/ksontini/Desktop/formx360/frontend/src/images/logo.png";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api";
import { toast, ToastContainer } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    iAgree: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // For button loading state
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!formData.iAgree) {
      newErrors.iAgree = "You must agree to the terms and conditions.";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setLoading(true); // Start loading
      try {
        // Send registration data to the backend
        const response = await registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });

        console.log("Registration successful:", response.data);
        toast.success(
          "Registration successful! Please check your email for a verification link."
        );

        // Reset form after submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          iAgree: false,
        });
        setErrors({});
        navigate("/users/login"); // Optionally navigate to a verification page
      } catch (error) {
        console.error(
          "Registration failed:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data.message || "Error during registration"
        );
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <section
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#28499A",
      }}
    >
      <Container>
        <Card
          className="shadow border-light"
          style={{ maxWidth: "1000px", margin: "5px auto" }}
        >
          <Button
            variant="light"
            className="position-absolute top-0 start-0 m-4 d-flex align-items-center"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft className="me-2" />
          </Button>
          <Row className="g-0">
            {/* Left Side */}
            <Col
              md={6}
              className="bg-light text-dark d-flex justify-content-center"
            >
              <div className="text-center p-4" style={{ margin: "150px 20px" }}>
                <img
                  style={{ paddingBottom: "50px" }}
                  className="img-fluid mb-3"
                  loading="lazy"
                  src={logo}
                  width="360"
                  alt="FormX360"
                />
                <h3
                  className="h3 fw-bold text-dark"
                  style={{ paddingBottom: "10px" }}
                >
                  Create forms that stand out in the digital world.
                </h3>
                <h6 className="text-muted small">
                  Join us to build smarter, digital forms.
                </h6>
              </div>
            </Col>

            {/* Right Side */}
            <Col md={6}>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="h4">Register</h2>
                  <p className="text-secondary small">
                    Fill out the form to create an account.
                  </p>
                </div>

                {/* Registration Form */}
                <Form onSubmit={handleSubmit}>
                  <Row className="gy-2">
                    <Col xs={12}>
                      <Form.Group controlId="firstName">
                        <Form.Label>
                          First Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={handleChange}
                          isInvalid={!!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group controlId="lastName">
                        <Form.Label>
                          Last Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={handleChange}
                          isInvalid={!!errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group controlId="email">
                        <Form.Label>
                          Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group controlId="password">
                        <Form.Label>
                          Password <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                          />
                          <Button
                            variant="outline-secondary"
                            style={{ border: 0 }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group controlId="iAgree">
                        <Form.Check
                          type="checkbox"
                          name="iAgree"
                          checked={formData.iAgree}
                          onChange={handleChange}
                          label={
                            <>
                              I agree to the{" "}
                              <a
                                href="#!"
                                className="text-primary text-decoration-none"
                              >
                                terms and conditions
                              </a>
                            </>
                          }
                          isInvalid={!!errors.iAgree}
                          feedback={errors.iAgree}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? "Signing Up..." : "Sign Up"}
                      </Button>
                    </Col>
                  </Row>
                </Form>

                {/* Footer Links */}
                <div className="text-center mt-4">
                  <hr className="border-secondary-subtle" />
                  <p className="text-secondary small">
                    Already have an account?{" "}
                    <a
                      href="#!"
                      className="text-primary text-decoration-none"
                      onClick={() => navigate("/users/login")}
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
      <ToastContainer />
    </section>
  );
}

export default Register;
