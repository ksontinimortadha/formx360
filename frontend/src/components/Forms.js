import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Card, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPencilAlt, FaTrash, FaPlus, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import AddFormModal from "../modals/AddFormModal";
import NavbarComponent from "./NavbarComponent";
import logo from "../images/logo.png";
import DeleteFormModal from "../modals/DeleteFormModal";
import ChangeVisibilityModal from "../modals/ChangeVisibilityModal";

function Forms() {
  const [forms, setForms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [formToEdit, setFormToEdit] = useState(null);
  const [companyId, setCompanyId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedCompanyId = sessionStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
      fetchForms(storedCompanyId);
    }
  }, []);

  const fetchForms = async (companyId) => {
    if (!companyId) return;
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/forms/${companyId}/forms`
      );
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Failed to fetch forms.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("companyId");
    navigate("/login");
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

    try {
      const newVisibility = form.visibility === "public" ? "private" : "public";

      await axios.put(
        `https://formx360.onrender.com/forms/${form._id}/visibility`,
        { visibility: newVisibility }
      );

      // Update local state
      setForms((prevForms) =>
        prevForms.map((f) =>
          f._id === form._id ? { ...f, visibility: newVisibility } : f
        )
      );

      toast.success(`Form is now ${newVisibility}`);

      // Fetch latest data from the server
      fetchForms(companyId);
    } catch (error) {
      console.error("Error updating visibility:", error.response || error);
      toast.error("Failed to update visibility.");
    }
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  return (
    <div>
      <NavbarComponent logo={logo} handleLogout={handleLogout} />
      <div style={{ height: "100vh", display: "flex" }}>
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <Container>
            <Row className="mb-4">
              <Card className="shadow-sm border-0 rounded-4 w-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>Forms Management</h4>
                    <Button variant="primary" onClick={handleShowAddModal}>
                      <FaPlus /> Add Form
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Row>
            <Row>
              {forms.length === 0 ? (
                <Col className="text-center">No forms available.</Col>
              ) : (
                forms.map((form) => (
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
                              <Dropdown.Item
                                onClick={() => handleShowVisibilityModal(form)}
                              >
                                Visibility Settings
                              </Dropdown.Item>

                              {/* Responses */}
                              <Dropdown.Item /* onClick={() => handleResponses(form)} */
                              >
                                View Responses
                              </Dropdown.Item>

                              {/* Permissions */}
                              <Dropdown.Item /* onClick={() => handlePermissions(form)} */
                              >
                                Permissions
                              </Dropdown.Item>

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

                              {/* Delete Form */}
                              <Dropdown.Item className="text-danger">
                                Delete Form
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
        </main>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Forms;
