import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  FaUser,
  FaEdit,
  FaRegAddressCard,
  FaLock,
  FaWpforms,
} from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "./NavbarComponent";
import { toast } from "react-toastify";
import EditUserModal from "../modals/EditUserModal";
import ProfileSidebar from "./ProfileSidebar";

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  useEffect(() => {
    const savedCompanyId = sessionStorage.getItem("companyId");
    const savedUserId = sessionStorage.getItem("userId");

    if (savedCompanyId) {
      setCompanyId(savedCompanyId);
    }

    if (savedUserId || userId) {
      const targetUserId = userId || savedUserId;
      if (companyId && targetUserId) {
        fetchUserInfo(companyId, targetUserId);
      }
    }
  }, [userId, companyId]);

  // Fetch user info
  const fetchUserInfo = async (companyId, userId) => {
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/companies/company/${companyId}/users/${userId}`
      );
      setUserInfo(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user info", error);
      setError("Failed to fetch user info, please try again later.");
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleEditUser = async (updatedUser) => {
    try {
      await axios.put(
        `https://formx360.onrender.com/companies/users/${userId}`,
        updatedUser
      );
      setShowModal(false);
      toast.success("Profile updated successfully!");

      fetchUserInfo(companyId, userId);
    } catch (error) {
      console.error("Failed to save changes", error);
      toast.error("Failed to save changes, please try again later.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container fluid>
      <NavbarComponent />

      <Row className="mb-4">
        {/* Sidebar */}
        <ProfileSidebar />

        {/* Main content */}
        <Col sm={9} md={9} lg={9}>
          <h1 style={{ padding: "20px" }} className="text-center mb-4">
            Personal Profile
          </h1>
          <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Body>
              {/* Personal Info */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-2">Name</h5>
                  <p className="lead mb-0">
                    {userInfo.firstName} {userInfo.lastName}
                  </p>
                </div>
                <Button
                  variant="outline-primary"
                  onClick={handleEditClick}
                  className="d-flex align-items-center gap-2"
                >
                  <FaEdit /> Edit my information
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-4">
                <h5 className="mb-2">Email</h5>
                <p className="lead mb-3">{userInfo.email}</p>

                <h5 className="mb-2">Phone</h5>
                <p className="lead mb-3">
                  {userInfo.phone ? (
                    userInfo.phone
                  ) : (
                    <span className="text-muted">No phone number set</span>
                  )}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <EditUserModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        firstName={userInfo.firstName}
        lastName={userInfo.lastName}
        email={userInfo.email}
        phone={userInfo.phone}
        handleEditUser={handleEditUser}
      />
    </Container>
  );
}

export default Profile;
