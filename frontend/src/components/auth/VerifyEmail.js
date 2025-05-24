import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.png";
import { verifyEmail } from "../../api";

const VerifyEmail = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(search).get("token");

  useEffect(() => {
    const verify = async () => {
      if (token) {
        try {
          await verifyEmail(token);
          setStatusMessage("Your email has been successfully verified!");
          setIsSuccess(true);
        } catch (error) {
          console.error("Verification error:", error);
          setStatusMessage(
            error.response?.data?.error ||
              "There was an issue verifying your email."
          );
          setIsSuccess(false);
        }
      }
    };

    verify();
  }, [token]);

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
                <img
                  style={{ paddingBottom: "30px" }}
                  className="img-fluid mb-3"
                  loading="lazy"
                  src={logo}
                  width="200"
                  alt="FormX360"
                />
                <h2 className="h4 fw-bold text-dark">Email Verification</h2>
                <p className="text-secondary small mb-4">
                  {isSuccess
                    ? "Congratulations! Your email has been successfully verified."
                    : "Please verify your email with the link sent to your inbox."}
                </p>
                <p className="text-muted">{statusMessage}</p>
              </div>
            </Col>
          </Row>
          <Card.Footer className="text-center bg-light">
            <Button
              variant="primary"
              onClick={() => navigate("/users/login")}
              disabled={!isSuccess}
            >
              Go to Login
            </Button>
          </Card.Footer>
        </Card>
      </Container>
    </section>
  );
};

export default VerifyEmail;
