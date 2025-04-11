import React, { useEffect, useState } from "react";
import { Container, Navbar, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaPowerOff, FaBell } from "react-icons/fa";
import logo from "../images/logo.png";
import socket from "../socket";

function NavbarComponent({ userId: propUserId }) {
  const [userId, setUserId] = useState(
    propUserId || sessionStorage.getItem("userId")
  );
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    fetch(`https://formx360.onrender.com/notifications/${userId}`)
      .then((res) => res.json())
      .then((data) =>
        setNotifications(
          data.map((notif) => ({
            id: notif._id,
            message: notif.message,
            read: notif.read,
          }))
        )
      )

      .catch((err) => console.error("🔴 Notification fetch error:", err));
  }, [userId]);

  useEffect(() => {
    const handleNewNotification = (data) => {
      setNotifications((prev) => [
        {
          id: data._id, // Backend must send full notification with _id
          message: data.message,
          read: false,
        },
        ...prev,
      ]);
    };

    socket.on("new_notification", handleNewNotification);
    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/users/login");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    fetch(`https://formx360.onrender.com/notifications/read-all/${userId}`, {
      method: "POST",
    }).catch((err) => console.error("🔴 Failed to mark all as read:", err));
  };

  const markSingleAsRead = (id) => {
    if (!id) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    fetch(`https://formx360.onrender.com/notifications/read/${id}`, {
      method: "POST",
    }).catch((err) =>
      console.error("🔴 Failed to mark notification as read:", err)
    );
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm py-2 border-bottom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard">
          <img src={logo} width="130" height="20" alt="Logo" />
        </Navbar.Brand>

        <div className="d-flex align-items-center ms-auto">
          {/* 🔔 Notifications */}
          <Dropdown align="end" className="me-3">
            <Dropdown.Toggle
              variant="link"
              className="p-0 position-relative"
              id="dropdown-notifications"
              style={{ fontSize: "1.4rem", color: "#28499A" }}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                  {unreadCount}
                </span>
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu
              align="end"
              className="px-2"
              style={{
                minWidth: "280px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className="d-flex justify-content-between align-items-center px-2 pt-2">
                <span className="fw-bold">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="btn btn-sm btn-outline-primary"
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
                    className={`d-flex justify-content-between align-items-center px-2 py-2 ${
                      !notif.read ? "bg-light" : ""
                    }`}
                    style={{ cursor: notif.id ? "pointer" : "default" }}
                  >
                    <span className="me-2" style={{ fontSize: "0.9rem" }}>
                      {notif.message}
                    </span>
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

          {/* 👤 Profile */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="p-0 ms-2"
              id="dropdown-profile"
              style={{ fontSize: "1.5rem", color: "#28499A" }}
            >
              <FaUserCircle />
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
              <Dropdown.Item as={Link} to={`/profile/${userId}`}>
                <FaUser className="me-2" />
                Profile Page
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
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
