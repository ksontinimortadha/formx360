import React, { useEffect, useState } from "react";
import { Container, Navbar, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaPowerOff, FaBell } from "react-icons/fa";
import logo from "../images/logo.png";
import socket from "../socket";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

function NavbarComponent({ userId: propUserId }) {
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const getUserNameById = async (id) => {
    try {
      const res = await axios.get(`https://formx360.onrender.com/users/${id}`);
      console.log("res", res);
      return res.data?.name || "Someone";
    } catch (err) {
      console.error("❌ Error fetching user name:", err);
      return "Someone";
    }
  };

  // 📨 Initial notification fetch
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `https://formx360.onrender.com/notifications/${userId}`
        );
        const data = res.data;

        const enhanced = await Promise.all(
          data.map(async (notif) => {
            const name =
              notif.createdByName ||
              (notif.createdBy && (await getUserNameById(notif.createdBy)));
            console.log("name", name);
            return {
              id: notif._id,
              message: notif.message,
              read: notif.read,
              createdBy: name,
              createdAt: notif.createdAt,
            };
          })
        );

        // Deduplicate (just in case)
        const unique = Array.from(
          new Map(enhanced.map((n) => [n.id, n])).values()
        );
        setNotifications(unique);
      } catch (err) {
        console.error("🔴 Notification fetch error:", err);
      }
    };

    fetchNotifications();
  }, [userId]);

  // 🔁 Real-time notification listener
  useEffect(() => {
    const handleNewNotification = async (data) => {
      const name =
        data.createdByName ||
        (data.createdBy && (await getUserNameById(data.createdBy)));

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === data._id);
        if (exists) return prev;

        return [
          {
            id: data._id,
            message: data.message,
            read: false,
            createdBy: name || "Someone",
            createdAt: data.createdAt || new Date().toISOString(),
          },
          ...prev,
        ];
      });
    };

    socket.on("new_notification", handleNewNotification);
    return () => socket.off("new_notification", handleNewNotification);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/users/login");
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await axios.patch(
        `https://formx360.onrender.com/notifications/read-all/${userId}`
      );
    } catch (error) {
      console.error("🔴 Failed to mark all as read:", error);
      toast.error("Failed to mark all as read. Please try again.");
    }
  };

  const markSingleAsRead = async (id) => {
    if (!id) return;

    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      await axios.patch(
        `https://formx360.onrender.com/notifications/read/${id}`
      );
    } catch (error) {
      console.error("🔴 Failed to mark notification as read:", error);
      toast.error("Failed to mark as read. Please try again.");
    }
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
                notifications.map((notif) => (
                  <Dropdown.ItemText
                    key={notif.id}
                    onClick={() => markSingleAsRead(notif.id)}
                    className={`d-flex flex-column px-2 py-2 ${
                      !notif.read ? "bg-light" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <span style={{ fontSize: "0.9rem" }}>{notif.message}</span>
                    <div className="d-flex justify-content-between mt-1">
                      <small className="text-muted">
                        {notif.createdBy ? `By ${notif.createdBy}` : ""}
                      </small>
                      <small className="text-muted">
                        {moment(notif.createdAt).fromNow()}
                      </small>
                    </div>
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
