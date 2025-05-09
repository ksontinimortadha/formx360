import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const FormSubmissionSuccess = ({ formTitle }) => {
  const { responseId } = useParams();
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/view-response/${responseId}`);
  };

  const handleEdit = () => {
    navigate(`/edit-response/${responseId}`);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="text-center">
            <h2>Thank you for your submission!</h2>
            <p>Your response has been successfully submitted.</p>
            <p>You can view or edit your response at any time.</p>
            <div className="d-flex justify-content-center gap-2">
              <Button variant="primary" onClick={handleView}>
                View Response
              </Button>
              <Button variant="secondary" onClick={handleEdit}>
                Edit Response
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FormSubmissionSuccess;
