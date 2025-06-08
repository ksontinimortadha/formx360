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
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Sidebar";
import AddFormModal from "../../modals/addForm/AddFormModal";
import NavbarComponent from "../NavbarComponent";
import DeleteFormModal from "../../modals/DeleteFormModal";
import ChangeVisibilityModal from "../../modals/ChangeVisibilityModal";
import PermissionsModal from "../../modals/PermissionsModal";
import FormActionsDropdown from "./FormActionsDropdown";

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
  const [existingPermissions, setExistingPermissions] = useState([]);
  const [highlightedFormId, setHighlightedFormId] = useState(null);

  useEffect(() => {
    const storedCompanyId = sessionStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
      fetchForms(storedCompanyId);
      fetchUsers(storedCompanyId);
    }
  }, []);
  const handlePermissions = (form) => {
    setSelectedForm(form);
    fetchFormPermissions(form._id);
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = async (formId, permissions) => {
    try {
      const response = await axios.post(
        "https://formx360.onrender.com/permissions/save",
        {
          formId,
          permissions,
        }
      );
      toast.success("Permissions saved successfully!");
      await fetchForms(companyId);
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Failed to save permissions.");
    }
  };

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

      setForms(response.data);
      setFilteredForms(response.data);
      
      // Fetch permissions for each form
      response.data.forEach((form) => {
        fetchFormPermissions(form._id);
      });
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

      // Update local state with full updated form 
      setForms((prevForms) =>
        prevForms.map((f) => (f._id === form._id ? updatedForm : f))
      );

      // show the private link to the user
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
    if (currentUserRole === "Super Admin") return true;
    if (!form || !form._id || !currentUserId) return false;

    const perms = existingPermissions[form._id] || [];
    return perms.some(
      (perm) =>
        perm.userId === currentUserId &&
        requiredPermissions.includes(perm.permission)
    );
  };

  const canManagePermissions = () =>
    currentUserRole === "Super Admin" || currentUserRole === "Admin";

  const handleLockForm = async (formId, lockStatus) => {
    try {
      const response = await axios.put(
        `https://formx360.onrender.com/forms/lock/${formId}`,
        { lockStatus }
      );
      await fetchForms(companyId);

      toast.success(`Form ${lockStatus ? "locked" : "unlocked"} successfully`);
    } catch (error) {
      console.error("Error locking/unlocking form:", error);
      toast.error("Failed to change lock status");
    }
  };

  const handleDuplicateForm = async (form) => {
    try {
      const response = await axios.post(
        `https://formx360.onrender.com/forms/duplicate/${form._id}`
      );

      toast.success("Form duplicated successfully!");

      const newForm = response.data; 
      setForms((prev) => [newForm, ...prev]);
      setFilteredForms((prev) => [newForm, ...prev]); 

      setHighlightedFormId(newForm._id);
      setTimeout(() => setHighlightedFormId(null), 3000); 

      await fetchForms(companyId);
    } catch (error) {
      console.error("Error duplicating form:", error);
      toast.error("Failed to duplicate the form.");
    }
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
                    <Card
                      className={`shadow-sm border-0 rounded-4 ${
                        highlightedFormId === form._id
                          ? "border border-success border-2"
                          : ""
                      }`}
                    >
                      <Card.Body className="d-flex justify-content-between align-items-center">
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

                        <div className="d-flex align-items-center">
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

                          {/* Delete Button */}
                          {hasPermission(form, "delete") && !form.locked ? (
                            <Button
                              variant="danger"
                              className="ms-2"
                              onClick={() => handleShowDeleteModal(form)}
                              title="Delete Form"
                            >
                              <FaTrash size={16} />
                            </Button>
                          ) : (
                            <Button
                              variant="danger"
                              className="ms-2"
                              disabled
                              title={
                                form.locked
                                  ? "Form is locked"
                                  : "You don't have delete permission"
                              }
                            >
                              <FaTrash size={16} />
                            </Button>
                          )}

                          {/* Dropdown for Form Actions */}
                          <FormActionsDropdown
                            form={form}
                            hasPermission={hasPermission}
                            handleShowVisibilityModal={
                              handleShowVisibilityModal
                            }
                            handlePermissions={handlePermissions}
                            canManagePermissions={canManagePermissions}
                            handleLockForm={handleLockForm}
                            handleDuplicateForm={handleDuplicateForm}
                          />
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
            currentUserRole={currentUserRole}
            onSave={handleSavePermissions}
            initialPermissions={existingPermissions}
            fetchForms={fetchForms}
          />
        </main>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Forms;
