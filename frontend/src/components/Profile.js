import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaUser, FaEdit, FaRegAddressCard, FaLock } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "./NavbarComponent";
import { toast } from "react-toastify";
import EditUserModal from "../modals/EditUserModal";

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle errors
  const [companyId, setCompanyId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  // Retrieve companyId and userId from sessionStorage (if not in URL params)
  useEffect(() => {
    const savedCompanyId = sessionStorage.getItem("companyId");
    const savedUserId = sessionStorage.getItem("userId");

    if (savedCompanyId) {
      setCompanyId(savedCompanyId);
    }

    if (savedUserId || userId) {
      // Use userId from URL or sessionStorage
      const targetUserId = userId || savedUserId;
      if (companyId && targetUserId) {
        fetchUserInfo(companyId, targetUserId); // Fetch user info with both companyId and userId
      }
    }

    console.log("Company ID from sessionStorage:", savedCompanyId);
    console.log("User ID from sessionStorage:", savedUserId);
  }, [userId, companyId]); // Only re-run if userId or companyId changes

  // Fetch user info
  const fetchUserInfo = async (companyId, userId) => {
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/companies/company/${companyId}/users/${userId}`
      );
      setUserInfo(response.data.user); // Ensure to access the user data properly
      console.log("user info:", response.data.user);
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
        `https://formx360.onrender.com/companies/users/${userId}`, // Using the userId in the URL
        updatedUser
      );
      setShowModal(false); // Close the modal after saving
      toast.success("Profile updated successfully!");
      // Optionally refetch the user data to update the UI
      fetchUserInfo(companyId, userId); // To reflect the updated user info
    } catch (error) {
      console.error("Failed to save changes", error);
      toast.error("Failed to save changes, please try again later.");
    }
  };

  // Dynamically set the Profile path with userId
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaUser /> },
    {
      path: `/profile/${userId}`,
      label: "Profile",
      icon: <FaRegAddressCard />,
    },
    { path: `/security/${userId}`, label: "Security", icon: <FaLock /> },
  ];

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container fluid>
      <NavbarComponent />

      <Row className="mb-4">
        {/* Sidebar */}
        <Col sm={3} md={3} lg={3} className="p-0">
          <aside
            style={{
              width: "250px",
              backgroundColor: "#0F283F",
              color: "#fff",
              minHeight: "100vh",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s ease",
            }}
          >
            <ul className="list-unstyled">
              {menuItems.map((item) => (
                <li
                  key={item.path}
                  className="mb-3"
                  style={{ border: "0", transition: "all 0.3s ease" }}
                >
                  <Button
                    variant="link"
                    className={`text-start w-100 d-flex align-items-center ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                    onClick={() => navigate(item.path)}
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      padding: "12px 20px",
                      backgroundColor:
                        location.pathname === item.path
                          ? "#1E4D6B"
                          : "transparent",
                      color: "#fff",
                      transition: "background-color 0.3s ease, color 0.3s ease",
                      borderRadius: "8px",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#1E4D6B")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor =
                        location.pathname === item.path
                          ? "#1E4D6B"
                          : "transparent")
                    }
                  >
                    <span
                      className="me-3"
                      style={{ fontSize: "20px", transition: "all 0.3s ease" }}
                    >
                      {item.icon}
                    </span>{" "}
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </aside>
        </Col>

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
