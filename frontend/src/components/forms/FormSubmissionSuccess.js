import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const FormSubmissionSuccess = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();

  const [formId, setFormId] = useState(null);
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [hasEditPermission, setHasEditPermission] = useState(false);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchResponseAndPermissions = async () => {
      try {
        const res = await axios.get(
          `https://formx360.onrender.com/responses/get/${responseId}`
        );
        const response = res.data;
        const form_id =
          typeof response.form_id === "object"
            ? response.form_id._id
            : response.form_id;

        setFormId(form_id);

        const permsRes = await axios.get(
          `https://formx360.onrender.com/permissions/${form_id}`
        );

        const permissions = permsRes.data.permissions || [];
        const flatPermissions = permissions.flatMap((perm) =>
          perm.permissions.map((p) => ({
            userId: perm.userId._id,
            permission: p,
          }))
        );

        const userPermissions = flatPermissions.filter(
          (perm) => perm.userId === userId
        );

        setHasViewPermission(
          userPermissions.some((perm) => perm.permission === "view")
        );
        setHasEditPermission(
          userPermissions.some((perm) => perm.permission === "edit")
        );
      } catch (error) {
        console.error("Error fetching response or permissions:", error);
        toast.error("Failed to validate permissions.");
      }
    };

    if (responseId && userId) {
      fetchResponseAndPermissions();
    }
  }, [responseId, userId]);

  const handleView = () => {
    navigate(`/view-response/${responseId}`);
  };

  const handleEdit = () => {
    navigate(`/edit-response/${responseId}`);
  };

  const handleExit = () => {
    navigate(`/user-dashboard`);
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
                  Your response has been successfully submitted.
                </p>
                <p className="text-muted">
                  You can view or edit your response if you have permission.
                </p>

                <div className="d-flex justify-content-center gap-2 mt-3">
                  {hasViewPermission && (
                    <Button variant="primary" onClick={handleView}>
                      View Response
                    </Button>
                  )}
                  {hasEditPermission && (
                    <Button variant="outline-secondary" onClick={handleEdit}>
                      Edit Response
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={handleExit}
                  style={{ marginTop: "20px", color: "#325FD7" }}
                >
                  <FaArrowLeft style={{ marginRight: "10px" }} />
                  Back to Dashboard
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </section>
  );
};

export default FormSubmissionSuccess;
