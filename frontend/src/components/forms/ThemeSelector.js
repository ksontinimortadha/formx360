import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./FormStylingPage.css";
import { predefinedThemes } from "./themes";
import { toast, ToastContainer } from "react-toastify";

function ThemeSelector({ onThemeChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const { formId } = useParams();
  const navigate = useNavigate();

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme.className);
    if (onThemeChange) {
      onThemeChange(theme.className);
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePreviewToggle = () => {
    navigate(`/preview/${formId}`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validate if selectedTheme exists
      if (!selectedTheme) {
        setError("Please select a theme.");
        setIsSaving(false);
        return;
      }

      // Send the selected theme to the backend
      const response = await axios.put(
        `https://formx360.onrender.com/forms/style/${formId}`,
        { theme: selectedTheme }
      );

      // Check if the update was successful (status code 200)
      if (response.status === 200) {
        toast.success("Theme saved successfully!");
      }

      setIsSaving(false);
    } catch (err) {
      console.error("Error saving theme:", err);

      // Check if err.response exists and log the error message from the server
      if (err.response) {
        console.error("Backend Error Message:", err.response.data);
      } else {
        console.error("Error Message:", err.message);
      }

      setIsSaving(false);
      setError("Error saving theme. Please try again.");
    }
  };

  return (
    <div
      className="theme-selector-container"
      style={{ width: "40%", marginLeft: "20px", marginTop: "20px" }}
    >
      <Card className="shadow-lg border-0 rounded-4 custom-card">
        <Card.Body>
          <h3>Select a Predefined Theme</h3>

          <div className="choosing-list-container" onClick={toggleDropdown}>
            <Button
              variant="secondary"
              onClick={handlePreviewToggle}
              className="mb-4"
            >
              <FaEye style={{ marginRight: "5px" }} />
              Preview Form
            </Button>

            <div
              className="choosing-list"
              style={{
                border: "1px solid #d1d1d6",
                padding: "12px 20px",
                fontSize: "16px",
                borderRadius: "10px",
                backgroundColor: "#f7f7f8",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span>
                {predefinedThemes.find(
                  (theme) => theme.className === selectedTheme
                )?.name || "Select a Theme"}
              </span>
              <div
                className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}
                style={{ marginLeft: "10px" }}
              />
            </div>

            {isDropdownOpen && (
              <div className="dropdown-options">
                {predefinedThemes.map((theme) => (
                  <div
                    key={theme.name}
                    className={`option ${
                      theme.className === selectedTheme ? "selected" : ""
                    }`}
                    onClick={() => handleThemeChange(theme)}
                  >
                    {theme.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="primary"
            className="mt-4 w-100"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          {error && <div className="error-message">{error}</div>}
        </Card.Body>
      </Card>
      <ToastContainer />
    </div>
  );
}

export default ThemeSelector;
