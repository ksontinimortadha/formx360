import React from "react";
import { Container, Button, Row, Col, Nav, Card } from "react-bootstrap";
import { FaCog, FaShareAlt, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import formIllustration from "./Forms.gif";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import HomeNavbar from "./HomeNavbar";

function Home() {
  return (
    <div>
      <HomeNavbar />

      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center text-center py-5">
        <Container className="position-relative">
          <Row className="align-items-center">
            <Col md={6} className="text-md-start text-center">
              <h1 className="display-4 fw-bold text-gradient">
                Build Smarter Forms with FormX360
              </h1>
              <p className="lead mt-3 text-muted">
                Create beautiful, powerful forms and share them in seconds.
                FormX360 makes data collection effortless so you can focus on
                what matters most.
              </p>
              <Link to="/users/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-4 px-4 py-2 rounded-pill shadow-sm"
                >
                  Get Started
                </Button>
              </Link>
            </Col>
            <Col md={6} className="text-center mt-4 mt-md-0">
              <img
                src={formIllustration}
                alt="Form Illustration"
                className="img-fluid rounded shadow-sm hero-gif"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light" id="features">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5 text-gradient">
              Why Choose FormX360?
            </h2>
            <p className="lead text-muted">
              Explore the key features that make form building fast, flexible,
              and powerful.
            </p>
          </div>
          <Row className="gy-4">
            {[
              {
                icon: <FaCog size={50} className="text-primary mb-3" />,
                title: "Custom Forms",
                description:
                  "Design your forms with drag-and-drop ease. No coding required! Choose from a variety of field types and fully tailor your forms.",
                link: "/form-builder",
              },
              {
                icon: <FaShareAlt size={50} className="text-success mb-3" />,
                title: "Share & Embed",
                description:
                  "Share forms via public links or embed them into your site effortlessly. Perfect for surveys, feedback, registration, and more.",
                link: "/share-forms",
              },
              {
                icon: <FaCheckCircle size={50} className="text-warning mb-3" />,
                title: "Real-time Analytics",
                description:
                  "Gain insights instantly with visual analytics and response tracking. Optimize your forms for better performance.",
                link: "/reports",
              },
            ].map((feature, index) => (
              <Col key={index} md={6} lg={4}>
                <Card className="feature-card shadow-sm h-100 text-center p-4 border-0">
                  <div className="text-center">{feature.icon}</div>{" "}
                  <h5 className="fw-semibold mt-2">{feature.title}</h5>
                  <p className="text-secondary">{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <p className="mb-0">© 2025 FormX360 | All Rights Reserved</p>
            </Col>
            <Col md={6} className="text-md-end">
              <Nav className="justify-content-center justify-content-md-end">
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
