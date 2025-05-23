import React from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Navbar,
  Nav,
  Card,
  Form,
  NavDropdown,
} from "react-bootstrap";
import { FaCog, FaShareAlt, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "./logo.png";
import formIllustration from "./Forms.gif";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";

function Home() {
  return (
    <div>
      {/* Top Navigation Bar */}
      <Navbar bg="light" expand="lg" className="shadow-sm py-2">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
              src={logo}
              width="130"
              height="20"
              className="d-inline-block align-top"
              alt="FormX360"
              style={{ margin: "10px" }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>

              {/* Features Menu */}
              <NavDropdown title="Features" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/form-builder-features">
                  Form Builder
                </NavDropdown.Item>

                <NavDropdown.Item href="#share-forms">
                  Share Forms
                </NavDropdown.Item>
                <NavDropdown.Item href="#customization">
                  Customization
                </NavDropdown.Item>
              </NavDropdown>

              {/* Solutions Menu with Nested Dropdown */}
              <NavDropdown title="Solutions" id="navbarScrollingDropdown">
                <div className="dropdown position-relative industry-dropdown">
                  <NavDropdown.Item
                    as="div"
                    className="dropdown-toggle"
                    id="industry-dropdown"
                    data-bs-toggle="dropdown"
                  >
                    By Industry
                  </NavDropdown.Item>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#industry-1">
                        Industry 1
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#industry-2">
                        Industry 2
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#industry-3">
                        Industry 3
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown position-relative industry-dropdown">
                  <NavDropdown.Item
                    as="div"
                    className="dropdown-toggle"
                    id="industry-dropdown"
                    data-bs-toggle="dropdown"
                  >
                    By Size
                  </NavDropdown.Item>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#Size-1">
                        Size 1
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#Size-2">
                        Size 2
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#Size-3">
                        Size 3
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown position-relative industry-dropdown">
                  <NavDropdown.Item
                    as="div"
                    className="dropdown-toggle"
                    id="industry-dropdown"
                    data-bs-toggle="dropdown"
                  >
                    By Role
                  </NavDropdown.Item>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#Role-1">
                        Role 1
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#Role-2">
                        Role 2
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#Role-3">
                        Role 3
                      </a>
                    </li>
                  </ul>
                </div>
              </NavDropdown>
            </Nav>

            <Form className="d-flex">
              <Link to="/users/register">
                <Button variant="primary" className="me-2 register-button">
                  Register
                </Button>
              </Link>
              <Link to="/users/login">
                <Button variant="outline-primary" className="login-button">
                  Login
                </Button>
              </Link>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section with Animated Illustration */}
      <section className="hero-section d-flex align-items-center justify-content-center text-center">
        <Container>
          <div className="hero-content">
            <h1 className="display-4 fw-bold">
              Efficient form creation with a powerful form builder
            </h1>
            <p className="lead mt-3">
              Build powerful forms for free, share them online, receive instant
              alerts, and efficiently manage your data with our integrated apps.
              Focus on your business while FormX360 Forms handles the data
              collection process for you!
            </p>
            <div className="d-flex justify-content-center">
              <Link to="/users/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-4 hero-button"
                  style={{ width: "200px" }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </Container>

        <img
          src={formIllustration}
          className="hero-illustration"
          alt="Form Illustration"
        />
      </section>

      {/* Features Section */}
      <section className="text-center py-5" id="features">
        <Container>
          <h2 className="mb-5">Features</h2>
          <Row className="gy-4">
            <Col md={6} lg={4}>
              <Card className="shadow-sm border-0 h-100 feature-card">
                <Card.Body>
                  <FaCog
                    size={60}
                    color="#007bff"
                    className="mb-3 feature-icon"
                  />
                  <Card.Title>Custom Forms</Card.Title>
                  <Card.Text>
                    Design your forms with drag-and-drop ease. No coding skills
                    required! Choose from a variety of field types and customize
                    your forms as you need them.
                  </Card.Text>
                  <Button variant="link" className="text-primary">
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="shadow-sm border-0 h-100 feature-card">
                <Card.Body>
                  <FaShareAlt
                    size={60}
                    color="#007bff"
                    className="mb-3 feature-icon"
                  />
                  <Card.Title>Share & Embed</Card.Title>
                  <Card.Text>
                    Easily share your forms via links or embed them directly
                    into your website. With our seamless integration, your forms
                    will reach your audience quickly.
                  </Card.Text>
                  <Button variant="link" className="text-primary">
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="shadow-sm border-0 h-100 feature-card">
                <Card.Body>
                  <FaCheckCircle
                    size={60}
                    color="#007bff"
                    className="mb-3 feature-icon"
                  />
                  <Card.Title>Real-time Analytics</Card.Title>
                  <Card.Text>
                    Monitor responses and gain insights instantly with our
                    real-time analytics tools. Track form performance and
                    optimize for better data collection and decision-making.
                  </Card.Text>
                  <Button variant="link" className="text-primary">
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <p className="mb-0">© 2025 FormX360 | All Rights Reserved</p>
            </Col>
            <Col md={6} className="text-md-end">
              <Nav className="justify-content-center justify-content-md-end footer-nav">
                <Nav.Link as={Link} to="/privacy-policy" className="text-white">
                  Privacy Policy
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/terms-of-service"
                  className="text-white"
                >
                  Terms of Service
                </Nav.Link>
                <Nav.Link as={Link} to="/contact-us" className="text-white">
                  Contact Us
                </Nav.Link>
              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default Home;
