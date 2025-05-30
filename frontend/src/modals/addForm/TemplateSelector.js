import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row, Spinner, Alert } from "react-bootstrap";
import TemplateNavBar from "./TemplateNavBar";

function TemplateSelector({ onPreview, openPreview, onSubmit, onBack }) {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://formx360.onrender.com/form-templates/get"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        setError("Failed to load templates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const categories = ["All", ...new Set(templates.map((t) => t.category))];
  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );
  }

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
        {filteredTemplates.length === 0 ? (
          <p>No templates found in this category.</p>
        ) : (
          filteredTemplates.map((template, idx) => (
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
          ))
        )}
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
