import axios from "axios";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FormActionsDropdown = ({
  form,
  hasPermission,
  handleShowVisibilityModal,
  handlePermissions,
  canManagePermissions,
}) => {
  const navigate = useNavigate();
    
  const handleResponses = (form) => {
    navigate(`/responses/form/${form._id}`);
  };
  const handleStats = (form) => {
    navigate(`/report-dashboard/${form._id}`);
  };

  const handleDuplicateForm = async (form) => {
    try {
      const response = await axios.post(
        `https://formx360.onrender.com/forms/duplicate/${form._id}`,
        {
          formId: form._id,
        }
      );
      toast.success("Form duplicated successfully!");
      // Optionally, you can update the UI with the new form data
      console.log("Duplicated form:", response.data);
    } catch (error) {
      console.error("Error duplicating form:", error);
      toast.error("Failed to duplicate the form.");
    }
  };

  const handleExportForm = async (form) => {
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/forms/export/${form._id}`,
        {
          responseType: "blob", // Handle the response as a file
        }
      );

      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${form.title}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting form:", error);
      toast.error("Failed to export the form.");
    }
  };

  const handleLockForm = async (form) => {
    try {
      const response = await axios.post(
        `https://formx360.onrender.com/forms/lock/${form._id}`,
        {
          formId: form._id,
          lockStatus: true, // Lock the form
        }
      );
      toast.success("Form locked successfully!");
      // Optionally, update the UI with the new locked status
      console.log("Form locked:", response.data);
    } catch (error) {
      console.error("Error locking form:", error);
      toast.error("Failed to lock the form.");
    }
  };


  
  return (
    <Dropdown align="end" className="ms-2">
      <Dropdown.Toggle
        variant="link"
        id="dropdown-custom-components"
        style={{ color: "black" }}
      >
        <FaEllipsisV size={16} style={{ color: "black" }} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* Visibility Settings */}
        {hasPermission(form, "edit") ? (
          <Dropdown.Item onClick={() => handleShowVisibilityModal(form)}>
            Visibility Settings
          </Dropdown.Item>
        ) : (
          <Dropdown.Item disabled title="You don't have permission">
            <span className="text-muted">Visibility Settings (Restricted)</span>
          </Dropdown.Item>
        )}

        {/* Responses */}
        {hasPermission(form, "view") ? (
          <Dropdown.Item onClick={() => handleResponses(form)}>
            View Responses
          </Dropdown.Item>
        ) : (
          <Dropdown.Item
            disabled
            title="You don't have permission to view responses"
          >
            <span className="text-muted">View Responses (Restricted)</span>
          </Dropdown.Item>
        )}

        {/* Statistics Dashboard */}
        {hasPermission(form, "view") ? (
          <Dropdown.Item onClick={() => handleStats(form)}>
            View Statistics Dashboard
          </Dropdown.Item>
        ) : (
          <Dropdown.Item
            disabled
            title="You don't have permission to view statistics"
          >
            <span className="text-muted">View Statistics (Restricted)</span>
          </Dropdown.Item>
        )}

        {/* Permissions */}
        {canManagePermissions() ? (
          <Dropdown.Item onClick={() => handlePermissions(form)}>
            Permissions
          </Dropdown.Item>
        ) : (
          <Dropdown.Item disabled title="Only Admins can manage permissions">
            <span className="text-muted">Permissions (Restricted)</span>
          </Dropdown.Item>
        )}

        {/* Duplicate Form */}
        <Dropdown.Item onClick={() => handleDuplicateForm(form)}>
          Duplicate Form
        </Dropdown.Item>

        {/* Export Form */}
        <Dropdown.Item onClick={() => handleExportForm(form)}>
          Export Form
        </Dropdown.Item>

        {/* Lock Form */}
        <Dropdown.Item onClick={() => handleLockForm(form)}>
          Lock Form
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FormActionsDropdown;
