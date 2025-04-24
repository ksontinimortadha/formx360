import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Dropdown,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPencilAlt, FaTrash, FaPlus, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Sidebar";
import AddFormModal from "../../modals/AddFormModal";
import NavbarComponent from "../NavbarComponent";
import DeleteFormModal from "../../modals/DeleteFormModal";
import ChangeVisibilityModal from "../../modals/ChangeVisibilityModal";
import PermissionsModal from "../../modals/PermissionsModal";

function Forms() {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [formToEdit, setFormToEdit] = useState(null);
  const [companyId, setCompanyId] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
const [showPermissionsModal, setShowPermissionsModal] = useState(false);
const [selectedForm, setSelectedForm] = useState(null);

const handlePermissions = (form) => {
  setSelectedForm(form);
  setShowPermissionsModal(true);
};

const handleSavePermissions = (formId, permissions) => {
  console.log("Saving permissions for form:", formId, permissions);
  // call your backend API here
};

  useEffect(() => {
    const storedCompanyId = sessionStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
      fetchForms(storedCompanyId);
      fetchUsers(storedCompanyId);
    }
  }, []);

  const fetchForms = async (companyId) => {
    if (!companyId) return;
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/forms/${companyId}/forms`
      );
      setForms(response.data);
      setFilteredForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
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
          console.log("role", currentUser.role);
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

  const handleShowDeleteModal = (form) => {
    setFormToEdit(form);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleShowVisibilityModal = (form) => {
    setFormToEdit(form);
    setShowVisibilityModal(true);
  };

  const handleCloseVisibilityModal = () => setShowVisibilityModal(false);

  const handleVisibilityChange = async (form) => {
    if (!form || !form._id) {
      toast.error("Invalid form data.");
      console.error("Invalid form data:", form);
      return;
    }

    const newVisibility = form.visibility === "public" ? "private" : "public";

    const payload = { visibility: newVisibility };

    if (newVisibility === "public") {
      payload.publicUrl = `https://formx360.vercel.app/responses/public/${form._id}`;
    }

    try {
      const response = await axios.put(
        `https://formx360.onrender.com/forms/${form._id}/visibility`,
        payload
      );

      const updatedForm = response.data.form;

      toast.success(`Form is now ${newVisibility}`);

      // Update local state with full updated form (includes privateUrl or publicUrl)
      setForms((prevForms) =>
        prevForms.map((f) => (f._id === form._id ? updatedForm : f))
      );

      // Optional: show the private link to the user
      if (newVisibility === "private" && updatedForm.privateUrl) {
        toast.info(`Private URL: ${updatedForm.privateUrl}`);
      }
      // Refresh form list
      fetchForms(companyId);
    } catch (error) {
      console.error("Error updating visibility:", error.response || error);
      toast.error("Failed to update visibility.");
    }
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleResponses = (form) => {
    navigate(`/responses/form/${form._id}`);
  };

  const handleStats = (form) => {
    navigate(`/report-dashboard/${form._id}`);
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

  return (
    <div>
      <NavbarComponent />
      <div style={{ height: "100vh", display: "flex" }}>
        <Sidebar />
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

                    {(currentUserRole === "Super Admin" ||
                      currentUserRole === "Admin") && (
                      <Button variant="primary" onClick={handleShowAddModal}>
                        <FaPlus className="me-1" />
                        Add Form
                      </Button>
                    )}
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
                    <Card className="shadow-sm border-0 rounded-4">
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                          <Card.Title>{form.title}</Card.Title>
                          <Card.Text>{form.description}</Card.Text>
                        </div>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="secondary"
                            onClick={() => handleEditForm(form)}
                          >
                            <FaPencilAlt size={16} />
                          </Button>
                          <Button
                            variant="danger"
                            className="ms-2"
                            onClick={() => handleShowDeleteModal(form)}
                          >
                            <FaTrash size={16} />
                          </Button>

                          {/* Dropdown for form settings */}
                          <Dropdown align="end" className="ms-2">
                            <Dropdown.Toggle
                              variant="link"
                              id="dropdown-custom-components"
                              style={{ color: "black" }}
                            >
                              <FaEllipsisV
                                size={16}
                                style={{ color: "black" }}
                              />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {/* Visibility Settings */}
                              {currentUserRole === "Super Admin" ||
                              currentUserRole === "Admin" ? (
                                <Dropdown.Item
                                  onClick={() =>
                                    handleShowVisibilityModal(form)
                                  }
                                >
                                  Visibility Settings
                                </Dropdown.Item>
                              ) : (
                                <Dropdown.Item
                                  disabled
                                  title="Only Admins can manage visibility"
                                >
                                  <span className="text-muted">
                                    Visibility Settings (Restricted)
                                  </span>
                                </Dropdown.Item>
                              )}

                              {/* Responses */}
                              {currentUserRole === "Super Admin" ||
                              currentUserRole === "Admin" ? (
                                <Dropdown.Item
                                  onClick={() => handleResponses(form)}
                                >
                                  View Responses
                                </Dropdown.Item>
                              ) : (
                                <Dropdown.Item
                                  disabled
                                  title="Only Admins can view responses"
                                >
                                  <span className="text-muted">
                                    View Responses (Restricted)
                                  </span>
                                </Dropdown.Item>
                              )}

                              {currentUserRole === "Super Admin" ||
                              currentUserRole === "Admin" ? (
                                <Dropdown.Item
                                  onClick={() => handleStats(form)}
                                >
                                  View Statistics Dashboard
                                </Dropdown.Item>
                              ) : (
                                <Dropdown.Item
                                  disabled
                                  title="Only Admins can view statistics"
                                >
                                  <span className="text-muted">
                                    View Statistics (Restricted)
                                  </span>
                                </Dropdown.Item>
                              )}

                              {/* Permissions */}
                              {currentUserRole === "Super Admin" ||
                              currentUserRole === "Admin" ? (
                                <Dropdown.Item
                                  onClick={() => handlePermissions(form)}
                                >
                                  Permissions
                                </Dropdown.Item>
                              ) : (
                                <Dropdown.Item
                                  disabled
                                  title="Only Admins can manage permissions"
                                >
                                  <span className="text-muted">
                                    Permissions (Restricted)
                                  </span>
                                </Dropdown.Item>
                              )}

                              {/* Duplicate Form */}
                              <Dropdown.Item /* onClick={() => handleDuplicateForm(form)} */
                              >
                                Duplicate Form
                              </Dropdown.Item>

                              {/* Export Form */}
                              <Dropdown.Item /* onClick={() => handleExportForm(form)} */
                              >
                                Export Form
                              </Dropdown.Item>

                              {/* Lock Form */}
                              <Dropdown.Item /* onClick={() => handleLockForm(form)} */
                              >
                                Lock Form
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Container>
          <AddFormModal
            show={showAddModal}
            handleClose={handleCloseAddModal}
            fetchForms={fetchForms}
            companyId={companyId}
          />

          <DeleteFormModal
            show={showDeleteModal}
            handleClose={handleCloseDeleteModal}
            formToEdit={formToEdit}
            fetchForms={fetchForms}
          />
          <ChangeVisibilityModal
            show={showVisibilityModal}
            handleClose={handleCloseVisibilityModal}
            form={formToEdit}
            handleVisibilityChange={handleVisibilityChange}
          />
          <PermissionsModal
            show={showPermissionsModal}
            handleClose={() => setShowPermissionsModal(false)}
            form={selectedForm}
            users={users}
            onSave={handleSavePermissions}
          />
        </main>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Forms;
