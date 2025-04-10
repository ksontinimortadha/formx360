import React, { useEffect, useState } from "react";
import { Container, Navbar, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaPowerOff, FaBell } from "react-icons/fa";
import logo from "../images/logo.png";
import socket from "../socket";

function NavbarComponent({ userId: propUserId }) {
  const [userId, setUserId] = useState(propUserId);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Fetch notifications from backend
  useEffect(() => {
    // Check if userId is available
    const currentUserId = userId || sessionStorage.getItem("userId");

    if (currentUserId) {
      // Fetch notifications from the backend for the logged-in user
      fetch(`https://formx360.onrender.com/notifications/${currentUserId}`)
        .then((response) => response.json())
        .then((data) => {
          setNotifications(data);
        })
        .catch((error) =>
          console.error("Error fetching notifications:", error)
        );
    }
  }, [userId]);

  useEffect(() => {
    // Listen to new notifications via socket
    socket.on("new_notification", (data) => {
      console.log("📬 New Notification:", data);
      setNotifications((prev) => [
        { id: Date.now(), message: data.message, read: false },
        ...prev,
      ]);
    });

    return () => {
      socket.off("new_notification");
    };
  }, []);

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const sessionUserId = sessionStorage.getItem("userId");
    if (!userId && sessionUserId) {
      setUserId(sessionUserId); // Fallback to sessionStorage if prop is not provided
    }
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.removeItem("companyId");
    sessionStorage.removeItem("userId");
    navigate("/users/login");
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  // Mark a single notification as read
  const markSingleAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
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
          {/* Notification Dropdown */}
          <Dropdown align="end" className="me-3">
            <Dropdown.Toggle
              variant="link"
              className="p-0 position-relative"
              id="dropdown-notifications"
              style={{
                fontSize: "1.4rem",
                color: "#28499A",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <FaBell style={{ color: "#28499A" }} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "0px",
                    left: "-15px",
                    background: "#56ADDE",
                    color: "white",
                    borderRadius: "50%",
                    fontSize: "0.65rem",
                    padding: "2px 5px",
                    lineHeight: "1",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu
              align="end"
              style={{
                minWidth: "280px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className="d-flex justify-content-between align-items-center px-3 pt-2">
                <span className="fw-bold">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="btn btn-sm btn-outline-primary"
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 6px",
                      borderRadius: "5px",
                    }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <Dropdown.Divider />

              {notifications.length === 0 ? (
                <Dropdown.ItemText className="text-muted text-center">
                  No notifications
                </Dropdown.ItemText>
              ) : (
                notifications.map((notif, index) => (
                  <Dropdown.ItemText
                    key={notif.id || index}
                    onClick={() => markSingleAsRead(notif.id)}
                    className="d-flex justify-content-between align-items-center px-3 py-2"
                    style={{
                      cursor: "pointer",
                      backgroundColor: notif.read ? "inherit" : "#f8f9fa",
                    }}
                  >
                    <span style={{ fontSize: "0.9rem" }}>{notif.message}</span>
                    {!notif.read && (
                      <span style={{ fontSize: "0.75rem", color: "red" }}>
                        ●
                      </span>
                    )}
                  </Dropdown.ItemText>
                ))
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="p-0 ms-2"
              id="dropdown-profile"
              style={{
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#28499A",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <FaUserCircle style={{ fontSize: "1.6rem" }} />
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
                to={`/profile/${userId}`}
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
