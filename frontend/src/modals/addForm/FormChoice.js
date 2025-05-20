import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaTools, FaClipboardList } from "react-icons/fa"; // Import icons

function FormChoice({ onSelect }) {
  return (
    <Row className="g-3 p-3">
      <Col md={6}>
        <Card
          className="shadow-sm h-100 selectable-card"
          onClick={() => onSelect("custom")}
          style={{ cursor: "pointer" }}
        >
          <Card.Body className="text-center">
            <h5 className="fw-bold mb-2">
              <FaTools size={24} className="me-2" />
              Create From Scratch
            </h5>
            <p className="text-muted">
              Build your own personalized form from the ground up.
            </p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card
          className="shadow-sm h-100 selectable-card"
          onClick={() => onSelect("template")}
          style={{ cursor: "pointer" }}
        >
          <Card.Body className="text-center">
            <h5 className="fw-bold mb-2">
              <FaClipboardList size={24} className="me-2" />
              Use a Template
            </h5>
            <p className="text-muted">
              Choose from predefined form templates to get started faster.
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default FormChoice;
