import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import {
  FaLock,
  FaCheckCircle,
  FaUser,
  FaRegAddressCard,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import ProfileSidebar from "./ProfileSidebar";

function Security() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Get the JWT token from localStorage
      if (!token) {
        setError("You need to be logged in.");
        setLoading(false);
        return;
      }

      // Call the backend API to change the password
      const response = await axios.put(
        `https://formx360.onrender.com/users/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the JWT token in the request header
          },
        }
      );

      setLoading(false);
      setSuccess(true);
      toast.success("Password updated successfully!");
    } catch (err) {
      setLoading(false);
      setError("Failed to update password. Please try again.");
      console.error(err);
    }
  };

  return (
    <Container fluid>
      <NavbarComponent />

      <Row className="mb-4">
        {/* Sidebar */}
        <ProfileSidebar />

        {/* Main content */}
        <Col sm={9} md={9} lg={9}>
          <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4 text-center">
                <FaLock /> Change Your Password
              </h5>
              {success && (
                <div className="alert alert-success">
                  <FaCheckCircle /> Password changed successfully.
                </div>
              )}
              {error && <div className="alert alert-danger">{error}</div>}

              <Form>
                <Form.Group controlId="currentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="newPassword" className="mt-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mt-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100 mt-4"
                  onClick={handlePasswordChange}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Security;
