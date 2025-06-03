import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaLink, FaEnvelope, FaUsers, FaClock } from "react-icons/fa";
import "./ShareFormsFeature.css";
import HomeNavbar from "./HomeNavbar";

const shareFeatures = [
  {
    icon: <FaLink size={50} className="text-primary mb-3" />,
    title: "Share via Public Link",
    description:
      "Generate a unique public URL to easily share your form with anyone — no sign-in required.",
  },
  {
    icon: <FaEnvelope size={50} className="text-success mb-3" />,
    title: "Send via Email",
    description:
      "Distribute forms directly to users’ inboxes and track delivery status for better follow-up.",
  },
  {
    icon: <FaUsers size={50} className="text-warning mb-3" />,
    title: "Target Specific Users",
    description:
      "Limit access to specific users or teams within your organization for controlled form sharing.",
  },
  {
    icon: <FaClock size={50} className="text-info mb-3" />,
    title: "Set Expiry & Access Limits",
    description:
      "Define time-based access or submission limits to maintain control and urgency.",
  },
];

const ShareFormsFeature = () => {
  return (
    <>
      <HomeNavbar />
      <section
        className="share-forms-section py-5"
        role="region"
        aria-labelledby="share-forms-heading"
      >
        <Container>
          <div className="text-center mb-5">
            <h2
              id="share-forms-heading"
              className="fw-bold display-5 text-gradient"
            >
              Seamlessly Share Your Forms
            </h2>
            <p className="lead text-muted">
              Share your forms easily via links, email, or social platforms —
              with full control and flexibility.
            </p>
          </div>

          <Row className="gy-4">
            {shareFeatures.map((feature, index) => (
              <Col key={index} md={9} lg={6}>
                <Card
                  className="feature-card shadow-sm h-100 text-center p-4"
                  role="article"
                  aria-label={feature.title}
                >
                  {feature.icon}
                  <h5 className="fw-semibold">{feature.title}</h5>
                  <p className="text-secondary">{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ShareFormsFeature;
