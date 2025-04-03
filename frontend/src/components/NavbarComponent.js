import React, { useEffect, useState } from "react";
import { Container, Navbar, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaPowerOff } from "react-icons/fa";
import logo from "../images/logo.png";

function NavbarComponent({ userId: propUserId }) {
  const [userId, setUserId] = useState(propUserId);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionUserId = sessionStorage.getItem("userId");

    if (!userId && sessionUserId) {
      setUserId(sessionUserId); // Fallback to sessionStorage if userId is not passed as prop
    }
  }, [userId]);
  const handleLogout = () => {
    sessionStorage.removeItem("companyId");
    sessionStorage.removeItem("userId");
    navigate("/users/login");
  };
  return (
    <Navbar
      bg="light"
      expand="lg"
      className="shadow-sm py-2"
      style={{ borderBottom: "1px solid #e0e0e0" }}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard">
          <img src={logo} width="130" height="20" alt="Logo" />
        </Navbar.Brand>
        <div className="d-flex align-items-center ms-auto">
          {/* Notification Icon */}

          {/* Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="p-0 ms-2"
              id="dropdown-profile"
              style={{
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#333",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <FaUserCircle
                style={{
                  fontSize: "1.6rem",
                }}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu
              align="end"
              style={{
                minWidth: "160px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Dropdown.Item
                as={Link}
                to={`/profile/${userId}`} // Dynamic route with userId
                style={{
                  fontSize: "1rem",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                <FaUser className="me-2" />
                Profile Page
              </Dropdown.Item>
              <Dropdown.Item
                onClick={handleLogout}
                style={{
                  fontSize: "1rem",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                <FaPowerOff className="me-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
