import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBuilding, FaWpforms, FaChartBar, FaTasks } from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Company", icon: <FaBuilding size={20} /> },
    { path: "/forms", label: "Forms", icon: <FaWpforms size={20} /> },
    { path: "/reports", label: "Reports", icon: <FaChartBar size={20} /> },
    { path: "/tasks", label: "Tasks", icon: <FaTasks size={20} /> },
  ];

  return (
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
                  location.pathname === item.path ? "#1E4D6B" : "transparent",
                color: "#fff",
                transition: "background-color 0.3s ease, color 0.3s ease",
                borderRadius: "8px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1E4D6B")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor =
                  location.pathname === item.path ? "#1E4D6B" : "transparent")
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
  );
}

export default Sidebar;
