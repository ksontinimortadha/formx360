import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPencilAlt, FaEdit, FaSave } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import EditCompanyModal from "../modals/EditCompanyModal";
import DeleteCompanyModal from "../modals/DeleteCompanyModal";
import DeleteUserModal from "../modals/DeleteUserModal";
import AddUserModal from "../modals/AddUserModal";
import NavbarComponent from "./NavbarComponent";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showDeleteCompanyModal, setShowDeleteCompanyModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [companyId, setCompanyId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const navigate = useNavigate();

  const [currentUserRole, setCurrentUserRole] = useState("");

  useEffect(() => {
    const savedCompanyId = sessionStorage.getItem("companyId");
    if (savedCompanyId) {
      setCompanyId(savedCompanyId);
      fetchUsers(savedCompanyId);
      fetchCompanyDetails(savedCompanyId);
    }
  }, [navigate]);

  const fetchCompanyDetails = async (companyId) => {
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/companies/company/${companyId}`
      );
      setCompanyDetails(response.data.company);
      fetchUsers(response.data.company);
    } catch (error) {
      toast.error("Failed to fetch company details.");
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

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(
      firstName &&
        lastName &&
        emailRegex.test(email) &&
        (password.length >= 6 || !password)
    );
  }, [firstName, lastName, email, password]);

  const handleShow = () => setShowModal(true);
  const handleCloseAddModal = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("User");
    setPassword("");
    setShowModal(false);
  };

  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleShowEditCompanyModal = () => setShowEditCompanyModal(true);
  const handleCloseEditCompanyModal = () => setShowEditCompanyModal(false);

  const handleSaveUser = async () => {
    try {
      const response = await axios.post(
        `https://formx360.onrender.com/companies/company/${companyId}/users`,
        {
          companyId,
          firstName,
          lastName,
          email,
          role,
        }
      );

      if (response.status === 201 || response.status === 200) {
        setUsers((prevUsers) => [...prevUsers, response.data.newUser]);
        toast.success("User added successfully!");
        handleCloseAddModal();
        fetchUsers(companyId);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(error.response?.data?.error || "Failed to add user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(
        `https://formx360.onrender.com/companies/users/${userId}`
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success("User deleted successfully!");
      handleCloseDeleteModal();
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const handleEditCompany = async () => {
    const updatedCompany = {
      name: companyDetails.name,
      industry: companyDetails.industry,
      description: companyDetails.description,
    };

    try {
      await axios.put(
        `https://formx360.onrender.com/companies/company/${companyId}`,
        updatedCompany
      );

      setCompanyDetails(updatedCompany);
      toast.success("Company updated successfully!");

      handleCloseEditCompanyModal();
    } catch (error) {
      toast.error("Failed to update company.");
      console.error(
        "Error updating company:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleEditRole = async (userId) => {
    try {
      const updatedUser = { role: newRole };
      await axios.put(
        `https://formx360.onrender.com/companies/users/${userId}`,
        updatedUser
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      setEditingUserId(null);
      setNewRole("");
      toast.success("User role updated successfully!");
    } catch (error) {
      toast.error("Failed to update user role.");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation Bar */}
      <NavbarComponent />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow-1" style={{ overflowY: "auto" }}>
          <header
            className="d-flex justify-content-between align-items-center p-3"
            style={{ borderBottom: "1px solid #ddd" }}
          >
            <h4>Company Management</h4>
            {companyDetails &&
              (currentUserRole === "Super Admin" ||
                currentUserRole === "Admin") && (
                <Button variant="primary" onClick={handleShow}>
                  Add User
                </Button>
              )}
          </header>

          <Container className="py-4">
            {companyDetails ? (
              <>
                {/* Company Details Section */}
                <Row className="mb-4">
                  <Col md={12}>
                    <Card className="shadow-sm border-0 rounded-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Card.Title className="fw-semibold">
                              {companyDetails.name}
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {companyDetails.industry}
                            </Card.Subtitle>
                            <Card.Text className="text-secondary">
                              {companyDetails.description}
                            </Card.Text>
                          </div>

                          {/* Minimalistic Buttons with Icons */}
                          {currentUserRole === "Super Admin" && (
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-secondary"
                                className="rounded-pill px-3 d-flex align-items-center gap-1"
                                onClick={handleShowEditCompanyModal}
                              >
                                <FaPencilAlt size={16} /> Edit
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Users Table Section */}
                <Table responsive="md" striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          {"No users found."}
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user?._id}>
                          {/* Name Column */}
                          <td>
                            {user?.firstName} {user?.lastName}
                          </td>
                          {/* Email Column */}
                          <td>{user?.email}</td>
                          {/* Role Column */}
                          <td>
                            {editingUserId === user?._id ? (
                              currentUserRole === "Super Admin" ||
                              currentUserRole === "Admin" ? (
                                <select
                                  value={newRole}
                                  onChange={(e) => setNewRole(e.target.value)}
                                  className="form-select form-select-sm"
                                >
                                  <option value="Super Admin">
                                    Super Admin
                                  </option>
                                  <option value="Admin">Admin</option>
                                  <option value="User">User</option>
                                </select>
                              ) : (
                                user?.role
                              )
                            ) : (
                              user?.role
                            )}
                          </td>
                          {/* Action Buttons */}

                          {(currentUserRole === "Super Admin" ||
                            currentUserRole === "Admin") && (
                            <div className="d-flex gap-2 align-items-center">
                              {/* Edit Role button logic */}
                              {(user?.role !== "Super Admin" ||
                                user?._id ===
                                  sessionStorage.getItem("userId")) && (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Edit Role</Tooltip>}
                                >
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="d-flex align-items-center gap-1"
                                    onClick={() => {
                                      setEditingUserId(user._id);
                                      setNewRole(user.role);
                                    }}
                                  >
                                    <FaEdit />
                                  </Button>
                                </OverlayTrigger>
                              )}

                              {/* Save button if editing */}
                              {editingUserId === user?._id && (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Save Role</Tooltip>}
                                >
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="d-flex align-items-center gap-1"
                                    onClick={() => handleEditRole(user?._id)}
                                  >
                                    <FaSave />
                                  </Button>
                                </OverlayTrigger>
                              )}

                              {/* Delete button, only for Super Admin and not self */}
                              {currentUserRole === "Super Admin" &&
                                user?._id !==
                                  sessionStorage.getItem("userId") && (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Delete User</Tooltip>}
                                  >
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="d-flex align-items-center gap-1"
                                      onClick={() => {
                                        setUserToEdit(user);
                                        handleShowDeleteModal();
                                      }}
                                    >
                                      <FaTrash />
                                    </Button>
                                  </OverlayTrigger>
                                )}
                            </div>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </>
            ) : (
              <p>Loading company details...</p>
            )}
          </Container>
        </main>
      </div>
      <EditCompanyModal
        show={showEditCompanyModal}
        handleClose={handleCloseEditCompanyModal}
        companyDetails={companyDetails}
        setCompanyDetails={setCompanyDetails}
        handleEditCompany={handleEditCompany}
      />

      <AddUserModal
        show={showModal}
        handleClose={handleCloseAddModal}
        handleSaveUser={handleSaveUser}
        firstName={firstName}
        lastName={lastName}
        email={email}
        role={role}
        password={password}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setEmail={setEmail}
        setRole={setRole}
        setPassword={setPassword}
        isValid={isValid}
      />

      <DeleteUserModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        userToEdit={userToEdit}
        handleDeleteUser={handleDeleteUser}
      />
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
