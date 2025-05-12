import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarComponent from "./NavbarComponent";
import UserSidebar from "./UserSideBar";

function UserDashboard() {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [existingPermissions, setExistingPermissions] = useState([]);
  const [highlightedFormId, setHighlightedFormId] = useState(null);

  useEffect(() => {
    const storedCompanyId = sessionStorage.getItem("companyId");

    const loadData = async () => {
      if (!storedCompanyId) return;

      await fetchUsers(storedCompanyId); // Ensures role is set before fetching forms
      fetchForms(storedCompanyId); // Now this uses the correct role
    };

    loadData();
  }, []);

  // Fetch existing permissions for a form
  const fetchFormPermissions = async (formId) => {
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/permissions/${formId}`
      );
      const fetched = response.data.permissions;

      const flatPermissions = fetched.flatMap((perm) =>
        perm.permissions.map((p) => ({
          userId: perm.userId._id,
          permission: p,
        }))
      );

      setExistingPermissions((prev) => ({
        ...prev,
        [formId]: flatPermissions,
      }));
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      toast.error("Failed to load permissions.");
    }
  };

  const fetchForms = async (companyId) => {
    if (!companyId) return;

    try {
      const response = await axios.get(
        `https://formx360.onrender.com/forms/${companyId}/forms`
      );
      const formsData = response.data;

      const currentUserId = sessionStorage.getItem("userId");

      // Fetch all permissions for all forms first
      const permissionsResponses = await Promise.all(
        formsData.map((form) =>
          axios.get(`https://formx360.onrender.com/permissions/${form._id}`)
        )
      );

      const newPermissions = {};

      formsData.forEach((form, index) => {
        const permissions = permissionsResponses[index].data.permissions;

        const flatPermissions = permissions.flatMap((perm) =>
          perm.permissions.map((p) => ({
            userId: perm.userId._id,
            permission: p,
          }))
        );

        newPermissions[form._id] = flatPermissions;
      });

      // Save permissions in state
      setExistingPermissions(newPermissions);

      // Filter forms where current user has "view" permission
      const viewableForms =
        currentUserRole === "Super Admin"
          ? formsData
          : formsData.filter((form) => {
              const perms = newPermissions[form._id] || [];
              return perms.some(
                (perm) =>
                  perm.userId === currentUserId && perm.permission === "view"
              );
            });

      setForms(formsData);
      setFilteredForms(viewableForms);
    } catch (error) {
      console.error("Error fetching forms or permissions:", error);
      toast.error("Failed to fetch forms.");
    }
  };

  const fetchUsers = async (companyId) => {
    if (!companyId) {
      toast.error("Company ID is missing!");
      return;
    }

    try {
      const response = await axios.get(
        `https://formx360.onrender.com/companies/company/${companyId}/users`
      );

      const userList = response.data.users || [];
      setUsers(userList);

      // Get current user ID from sessionStorage
      const currentUserId = sessionStorage.getItem("userId");

      if (currentUserId) {
        const currentUser = userList.find((user) => user._id === currentUserId);
        if (currentUser) {
          setCurrentUserRole(currentUser.role);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
      setUsers([]);
    }
  };
  const handleEditForm = (form) => {
    navigate(`/form-builder/${form._id}`);
  };

  // Handle the search input change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Filter forms based on the search term
    const filtered = forms.filter((form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForms(filtered);
  };

  const hasPermission = (form, ...requiredPermissions) => {
    const currentUserId = sessionStorage.getItem("userId");
    if (!form || !form._id || !currentUserId) return false;

    const perms = existingPermissions[form._id] || [];
    return perms.some(
      (perm) =>
        perm.userId === currentUserId &&
        requiredPermissions.includes(perm.permission)
    );
  };

  return (
    <div>
      <NavbarComponent />
      <div style={{ height: "100vh", display: "flex" }}>
        <UserSidebar />
        <main className="flex-grow-1 p-4">
          <Container>
            <Row className="mb-4">
              <Card className="shadow-sm border-0 rounded-4 w-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>Forms Management</h4>

                    <Form.Control
                      style={{ width: "auto", marginLeft: "350px" }}
                      type="search"
                      placeholder="Search Form"
                      aria-label="Search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Row>

            <Row>
              {filteredForms.length === 0 ? (
                <Col className="text-center">No forms found.</Col>
              ) : (
                filteredForms.map((form) => (
                  <Col key={form._id} md={12} className="mb-3">
                    <Card
                      className={`shadow-sm border-0 rounded-4 ${
                        highlightedFormId === form._id
                          ? "border border-success border-2"
                          : ""
                      }`}
                    >
                      <Card.Body
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const formUrl = form.privateUrl || form.publicUrl;
                          if (formUrl) {
                            window.open(formUrl, "_blank"); // Open in a new tab
                          } else {
                            toast.error("No URL available for this form.");
                          }
                        }}
                      >
                        <div>
                          <Card.Title>
                            {form.title}{" "}
                            {form.locked && (
                              <Badge bg="secondary" className="ms-2">
                                Locked
                              </Badge>
                            )}
                          </Card.Title>
                          <Card.Text>{form.description}</Card.Text>
                        </div>

                        <div
                          className="d-flex align-items-center"
                          onClick={(e) => e.stopPropagation()} // 👈 Prevent edit click from bubbling to card click
                        >
                          {/* Edit Button */}
                          {hasPermission(form, "edit") && !form.locked ? (
                            <Button
                              variant="secondary"
                              onClick={() => handleEditForm(form)}
                              title="Edit Form"
                            >
                              <FaPencilAlt size={16} />
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              disabled
                              title={
                                form.locked
                                  ? "Form is locked"
                                  : "You don't have edit permission"
                              }
                            >
                              <FaPencilAlt size={16} />
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Container>
        </main>
        <ToastContainer />
      </div>
    </div>
  );
}

export default UserDashboard;
