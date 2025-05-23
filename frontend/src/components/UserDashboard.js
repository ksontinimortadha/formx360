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
import { FaExternalLinkAlt, FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarComponent from "./NavbarComponent";
import UserSidebar from "./UserSideBar";
import UserFormActionsDropdown from "./UserFormActionsDropdown";

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

      await fetchUsers(storedCompanyId);
      fetchForms(storedCompanyId);
    };

    loadData();
  }, []);

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

      setExistingPermissions(newPermissions);

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

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

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
        <main className="flex-grow-1 p-4 bg-light">
          <Container>
            <Row className="mb-4">
              <Card className="shadow-sm border-0 rounded-4 w-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">My Forms</h4>
                    <Form.Control
                      style={{ width: "300px" }}
                      type="search"
                      placeholder="Search Form"
                      aria-label="Search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="shadow-sm rounded-pill"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Row>

            <Row>
              {filteredForms.length === 0 ? (
                <Col className="text-center py-5 text-muted">
                  No forms found.
                </Col>
              ) : (
                filteredForms.map((form) => (
                  <Col key={form._id} md={12} className="mb-3">
                    <Card
                      className={`shadow-sm border-0 rounded-4 ${
                        highlightedFormId === form._id
                          ? "border border-success border-2"
                          : ""
                      }`}
                      onMouseEnter={() => setHighlightedFormId(form._id)}
                      onMouseLeave={() => setHighlightedFormId(null)}
                      style={{
                        cursor: "default",
                        transition: "box-shadow 0.2s",
                      }}
                    >
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                          <Card.Title className="mb-1">
                            {form.title}{" "}
                            {form.locked && (
                              <Badge bg="secondary" className="ms-2">
                                Locked
                              </Badge>
                            )}
                          </Card.Title>
                          <Card.Text
                            className="mb-0 text-secondary"
                            style={{ maxWidth: "400px" }}
                          >
                            {form.description}
                          </Card.Text>
                        </div>

                        <div
                          className="d-flex align-items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Fill Form Button */}
                          {hasPermission(form, "view") && (
                            <Button
                              variant="primary"
                              onClick={() => {
                                const formUrl =
                                  form.privateUrl || form.publicUrl;
                                if (formUrl) {
                                  window.open(formUrl, "_blank");
                                } else {
                                  toast.error(
                                    "No URL available for this form."
                                  );
                                }
                              }}
                              title="Fill this Form"
                              className="d-flex align-items-center gap-2"
                            >
                              <FaExternalLinkAlt />
                              Fill Form
                            </Button>
                          )}

                          {/* Edit Button */}
                          {hasPermission(form, "edit") && !form.locked && (
                            <Button
                              variant="outline-secondary"
                              onClick={() => handleEditForm(form)}
                              title="Edit Form"
                            >
                              <FaPencilAlt size={16} />
                            </Button>
                          )}
                        {/* Dropdown for Form Actions */}
                        <UserFormActionsDropdown
                          form={form}
                          hasPermission={hasPermission}
                        />
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
