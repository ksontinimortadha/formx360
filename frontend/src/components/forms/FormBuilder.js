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

  const [formTitle, setFormTitle] = useState();
  const [formDescription, setFormDescription] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

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

        // Set progress to 50% if fields are loaded
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

  const handleSaveForm = async () => {
    try {
      setIsSaving(true);

      // Get form data from formBuilder instance
      const updatedFields = JSON.parse(
        $(fb.current).data("formBuilder").actions.getData("json", true)
      );

      if (!Array.isArray(updatedFields)) {
        toast.error("Invalid form data. Please refresh and try again.");
        return;
      }

      // Process each field
      updatedFields.forEach((field) => {
        if (["checkbox-group", "radio-group", "select"].includes(field.type)) {
          // Ensure options array exists
          field.options = field.options || [];

          // Standardize the structure of options
          field.options = field.options.map((option) => ({
            label: option.label || option, // Ensure label exists
            value: option.value || option, // Ensure value exists
            selected: option.selected ?? false, // Default to false if missing
          }));
        }
      });

      // Send updated form data to the backend
      await axios.put(`https://formx360.onrender.com/forms/${formId}`, {
        title: formTitle,
        description: formDescription,
        fields: updatedFields,
      });

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
    navigate("/forms");
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
                  disabled={isSaving}
                  className="mr-3"
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
