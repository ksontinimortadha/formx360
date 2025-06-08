import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function EditStyleModal({
  show,
  onHide,
  fieldStyles,
  selectedField,
  formId,
  handleStyleChange,
}) {
  const [updatedStyles, setUpdatedStyles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedField && formId) {
      const fetchFormData = async () => {
        try {
          const response = await axios.get(
            `https://formx360.onrender.com/forms/${formId}`
          );
          const styles = response.data.form.fieldStyles[selectedField];
          if (styles) {
            setUpdatedStyles(styles);
          }
        } catch (err) {
          console.error("Error fetching form data:", err);
          setError("Error loading form. Please try again.");
        }
      };
      fetchFormData();
    }
  }, [formId, selectedField]);

  const handleChange = (styleKey, value) => {
    setUpdatedStyles((prev) => {
      const newState = { ...prev, [styleKey]: value };
      return newState;
    });
    handleStyleChange(styleKey, value);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!selectedField || !formId) {
        setError("No field or form selected.");
        setIsSaving(false);
        return;
      }

      const dataToUpdate = {};

      if (updatedStyles.backgroundColor) {
        dataToUpdate.backgroundColor = updatedStyles.backgroundColor;
      }
      if (updatedStyles.color) {
        dataToUpdate.color = updatedStyles.color;
      }
      if (updatedStyles.position) {
        dataToUpdate.position = updatedStyles.position;
      }

      if (Object.keys(dataToUpdate).length === 0) {
        setError("No changes made to the field styles.");
        setIsSaving(false);
        return;
      }

      const response = await axios.put(
        `https://formx360.onrender.com/forms/${formId}/fields/${selectedField}/style`,
        dataToUpdate
      );

      if (response.status === 200) {
        toast.success("Field styles saved successfully!");
        onHide();
      } else {
        setError("Failed to save the field styles. Please try again.");
      }
    } catch (err) {
      console.error("Error saving styles:", err);
      setError("An error occurred while saving the styles.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName="right-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-lg font-semibold text-gray-800">
          Customize Field Style
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="p-5 space-y-6 bg-gray-50 rounded-2xl"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        {error && <div className="text-red-500">{error}</div>}
        <div className="form-styling-controls space-y-4">
          <div className="control-group space-y-1">
            <label
              className="text-gray-700 font-medium pr-5"
              style={{ marginRight: "15px" }}
            >
              Background Color
            </label>
            <input
              type="color"
              className="w-full h-10 rounded-lg border border-gray-300 p-1 cursor-pointer"
              value={updatedStyles.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
            />
            <p style={{ color: "grey" }}>
              Choose the background color for the element.
            </p>
          </div>

          <div className="control-group space-y-1">
            <label
              className="text-gray-700 font-medium pr-5"
              style={{ marginRight: "15px" }}
            >
              Text Color
            </label>
            <input
              type="color"
              className="w-full h-10 rounded-lg border border-gray-300 p-1 cursor-pointer"
              value={updatedStyles.color}
              onChange={(e) => handleChange("color", e.target.value)}
            />
            <p style={{ color: "grey" }}>
              Select the text color for the element.
            </p>
          </div>

          <div className="control-group space-y-1">
            <label className="text-gray-700 font-medium pr-5">Position</label>
            <select
              style={{ height: "30px" }}
              className="w-full h-10 rounded-lg border border-gray-300 p-1"
              value={updatedStyles.position || "left"}
              onChange={(e) => handleChange("position", e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <p style={{ color: "grey" }}>
              Choose the position of the element (left, center, or right).
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 flex justify-between px-3 pb-3">
        <Button
          variant="light"
          className="w-full py-2 rounded-full text-gray-700"
          onClick={onHide}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="w-full py-2 rounded-full bg-blue-500 text-white"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
}

export default EditStyleModal;
