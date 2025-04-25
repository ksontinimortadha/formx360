import React from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa";

const FormActionsDropdown = ({
  form,
  hasPermission,
  handleShowVisibilityModal,
  handleResponses,
  handleStats,
  handlePermissions,
  canManagePermissions,
}) => {
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
        <Dropdown.Item>Duplicate Form</Dropdown.Item>

        {/* Export Form */}
        <Dropdown.Item>Export Form</Dropdown.Item>

        {/* Lock Form */}
        <Dropdown.Item>Lock Form</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FormActionsDropdown;
