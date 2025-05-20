import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ProgressBarComponent from "./ProgressBarComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FormBuilder.css";
import $ from "jquery";
import { toast, ToastContainer } from "react-toastify";

window.jQuery = $;
window.$ = $;

require("jquery-ui-sortable");
require("formBuilder");

const FormBuilder = () => {
  const fb = useRef(null);
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [users, setUsers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState("");
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://formx360.onrender.com/forms/${formId}`
        );
        const form = response.data.form;
        setFormData(form);
        setFormTitle(form.title || "Untitled Form");
        setFormDescription(form.description || "");
        const companyId = sessionStorage.getItem("companyId");

        // Call fetchUsers with companyId from the form
        if (companyId) {
          await fetchUsers(companyId);
        }

        const validatedFields =
          form.fields?.map((field, index) => {
            if (!field.type)
              console.warn(`Missing type for field at index ${index}`);
            return field;
          }) || [];

        if (fb.current && !$(fb.current).data("formBuilder")) {
          $(fb.current).formBuilder({
            formData: validatedFields,
            onSave: () => handleSaveForm(),
          });
        }

        setProgress(validatedFields.length > 0 ? 50 : 0);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Error loading form. Please try again.");
        setFormTitle("Error Loading Form");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

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
        // Compare as strings to avoid type issues
        const currentUser = userList.find(
          (user) => String(user._id) === String(currentUserId)
        );
        if (currentUser) {
          setCurrentUserRole(currentUser.role);
        } else {
          console.warn("Current user not found in company users list.");
          setCurrentUserRole(""); // fallback
        }
      } else {
        console.warn("No userId found in sessionStorage.");
        setCurrentUserRole(""); // fallback
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
      setUsers([]);
      setCurrentUserRole(""); // fallback
    }
  };
  useEffect(() => {
    if (formData ) {
      setFormTitle(formData.title || "");
      setFormDescription(formData.description || "");
    }
  }, [formData]);
  
  const handleSaveForm = async () => {
    try {
      setIsSaving(true);

      // Grab title input value directly from DOM instead of relying on React state
      const titleInputValue = document
        .querySelector(".form-title-input")
        ?.value?.trim();

      // Also grab description directly if needed
      const descriptionInputValue = document
        .querySelector(".form-description-input")
        ?.value?.trim();

      const updatedFields = JSON.parse(
        $(fb.current).data("formBuilder").actions.getData("json", true)
      );

      if (!Array.isArray(updatedFields)) {
        toast.error("Invalid form data. Please refresh and try again.");
        setIsSaving(false);
        return;
      }

      updatedFields.forEach((field) => {
        if (["checkbox-group", "radio-group", "select"].includes(field.type)) {
          field.options = (field.options || []).map((option) => ({
            label: option.label || option,
            value: option.value || option,
            selected: option.selected ?? false,
          }));
        }
      });

      // Use the direct DOM values (fall back if missing)
      const titleToSave = titleInputValue || formData?.title || "Untitled Form";
      const descriptionToSave =
        descriptionInputValue || formData?.description || "";

      const response = await axios.patch(
        `https://formx360.onrender.com/forms/${formId}`,
        {
          title: titleToSave,
          description: descriptionToSave,
          fields: updatedFields,
        }
      );

      if (response.data.form) {
        setFormData(response.data.form);
        setFormTitle(response.data.form.title || "");
        setFormDescription(response.data.form.description || "");
      }
      setProgress(100);
      toast.success("Form saved successfully!");
    } catch (err) {
      console.error("Error saving form:", err);
      setError("Error saving form. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  

  const handleTitleChange = (e) => {
    setFormTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setFormDescription(e.target.value);
  };

  const handleBackButtonClick = () => {
    const role = currentUserRole.toLowerCase().replace(/\s/g, "");
    if (role === "admin" || role === "superadmin") {
      navigate("/forms");
    } else {
      navigate("/user-dashboard");
    }
  };

  return (
    <div className="form-builder-container">
      <Container className="my-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={handleBackButtonClick}
                  className="mr-3"
                  aria-label="Back Button"
                >
                  <FaArrowLeft className="mr-2" />
                </Button>
              </div>
              <h1 className="text-center w-100 form-builder-title mx-auto">
                Create Your Custom Form
              </h1>
              <div className="d-flex align-items-center">
                <Button
                  size="sm"
                  onClick={() => navigate(`/form-styling/${formId}`)}
                  className="next-step-btn mr-3"
                >
                  Next Step - Style your Form
                </Button>
              </div>
            </div>

            {/* Use the ProgressBarComponent here */}
            <ProgressBarComponent progress={progress} />

            <Card className="shadow-lg border-0 rounded-4 custom-card">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center mb-3">
                  {loading ? (
                    <div className="d-flex justify-content-center">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : error ? (
                    <Alert variant="danger" className="w-100">
                      {error}
                    </Alert>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        value={formTitle}
                        onChange={handleTitleChange}
                        className="form-title-input"
                        placeholder="Enter Form Title"
                        disabled={isSaving}
                        style={{ width: "90%", height: "40px" }}
                        aria-label="Form Title"
                      />
                      <Button
                        variant="outline-primary"
                        onClick={handleSaveForm}
                        disabled={isSaving || !formTitle}
                        style={{
                          width: "10%",
                          height: "40px",
                          marginLeft: "10px",
                        }}
                        aria-label="Save Form Title"
                      >
                        Save Title
                      </Button>
                    </>
                  )}
                </div>

                <div className="d-flex align-items-center mb-3">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formDescription}
                    onChange={handleDescriptionChange}
                    className="form-description-input"
                    placeholder="Enter Form Description"
                    disabled={isSaving}
                    style={{ width: "100%", height: "80px" }}
                    aria-label="Form Description"
                  />
                  <Button
                    variant="outline-primary"
                    onClick={handleSaveForm}
                    style={{ width: "15%", height: "80px", marginLeft: "5px" }}
                    aria-label="Save Form Description"
                  >
                    Save Description
                  </Button>
                </div>

                <div className="guide-text mb-3">
                  <p>
                    Use the form builder below to easily design your form.
                    <br />
                    Simply drag and drop fields to customize the layout and
                    structure according to your needs.
                  </p>
                </div>
              </Card.Body>
            </Card>
            <Card className="shadow-lg border-0 rounded-4 custom-form-builder-card">
              <Card.Body>
                <h3 className="form-builder-title mb-4">Form Builder</h3>
                <div
                  ref={fb}
                  className="fb-container custom-fb-container"
                ></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default FormBuilder;
