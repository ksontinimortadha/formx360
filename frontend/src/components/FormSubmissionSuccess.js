import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const FormSubmissionSuccess = ({ responseId, formTitle }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="text-center">
            <h2>Thank you for your submission!</h2>
            <p>Your response has been successfully submitted.</p>
            <p>You can view or edit your response at any time.</p>
            <div>
              <Link to={`/view-response/${responseId}`}>
                <Button variant="primary" className="mr-3">
                  View Response
                </Button>
              </Link>
              <Link to={`/edit-response/${responseId}`}>
                <Button variant="secondary">Edit Response</Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FormSubmissionSuccess;
