import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const FormSubmissionSuccess = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/view-response/${responseId}`);
  };

  const handleEdit = () => {
    navigate(`/edit-response/${responseId}`);
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
          style={{ maxWidth: "600px", margin: "auto" }}
        >
          <Row className="g-0">
            <Col
              md={12}
              className="bg-light text-dark d-flex justify-content-center"
            >
              <div className="text-center p-4">
                <h2 className="h4 fw-bold text-dark">
                  Thank you for your submission!
                </h2>
                <p className="text-secondary small mb-2">
                  Your response has been successfully submitted
                </p>
                <p className="text-muted">
                  You can view or edit your response at any time.
                </p>
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <Button variant="primary" onClick={handleView}>
                    View Response
                  </Button>
                  <Button variant="outline-secondary" onClick={handleEdit}>
                    Edit Response
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </section>
  );
};

export default FormSubmissionSuccess;
