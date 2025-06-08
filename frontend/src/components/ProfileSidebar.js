import React, { useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaLock, FaRegAddressCard, FaUser, FaWpforms } from "react-icons/fa";

const ProfileSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  useEffect(() => {
    if (userInfo?._id) {
      const userRole = userInfo.role;

      setMenuItems([
        {
          path: userRole === "User" ? "/user-dashboard" : "/dashboard",
          label: userRole === "User" ? "Forms" : "dashboard",
          icon: userRole === "User" ? <FaWpforms /> : <FaUser />,
        },
        {
          path: `/profile/${userInfo._id}`,
          label: "Profile",
          icon: <FaRegAddressCard />,
        },
        {
          path: `/security/${userInfo._id}`,
          label: "Security",
          icon: <FaLock />,
        },
      ]);
    }
  }, [userInfo]);
  return (
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
                    location.pathname === item.path ? "#1E4D6B" : "transparent",
                  color: "#fff",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                  borderRadius: "8px",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#1E4D6B")
                }
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
    </Col>
  );
};

export default ProfileSidebar;
