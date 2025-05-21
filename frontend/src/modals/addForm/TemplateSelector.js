import React, { useState } from "react";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import TemplateNavBar from "./TemplateNavBar";

function TemplateSelector({
  templates,
  onPreview,
  openPreview,
  onSubmit,
  onBack,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(templates.map((t) => t.category))];

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="p-3">
      <TemplateNavBar
        categories={categories}
        selectedCategory={selectedCategory}
        onChange={setSelectedCategory}
      />
      <h5 className="fw-bold mb-3" style={{ marginTop: "10px" }}>
        Choose a Template
      </h5>

      <Row className="g-3">
        {filteredTemplates.map((template, idx) => (
          <Col md={6} key={idx}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="fs-6">{template.title}</Card.Title>
                <Card.Text className="text-muted" style={{ minHeight: 60 }}>
                  {template.description}
                </Card.Text>
                <div className="d-flex justify-content-between gap-2 mt-2">
                  <Button
                    variant="outline-primary"
                    className="w-50"
                    onClick={() => {
                      onPreview(template);
                      openPreview();
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="success"
                    className="w-50"
                    onClick={(e) => onSubmit(e, template)}
                  >
                    Use Template
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-end mt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}

export default TemplateSelector;
