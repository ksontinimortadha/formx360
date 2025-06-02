import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Form, Badge, ListGroup } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaWpforms, FaPenAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const PermissionsModal = ({
  show,
  handleClose,
  form,
  users,
  onSave,
  initialPermissions = [],
  currentUserRole,
  companyId,
  fetchForms, // Added this prop to fetch forms after saving
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [existingPermissions, setExistingPermissions] = useState({});

  const canEditPermissions =
    currentUserRole === "Super Admin" || currentUserRole === "Admin";

  // Fetch existing permissions for the form
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

      // Update selectedPermissions based on fetched data
      setSelectedPermissions(flatPermissions);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      toast.error("Failed to load permissions.");
    }
  };

  // Update permissions when form changes
  useEffect(() => {
    if (form?._id) {
      fetchFormPermissions(form._id); // Fetch existing permissions when form is available
    }
  }, [form]);

  // Handler for changing checkbox state
  const handleCheckboxChange = useCallback(
    (userId, permission) => {
      const user = users.find((u) => u._id === userId);
      if (user?.role === "Super Admin") return; // Ignore changes for Super Admin

      setSelectedPermissions((prev) => {
        const index = prev.findIndex(
          (p) => p.userId === userId && p.permission === permission
        );

        if (index > -1) {
          // Remove permission if it exists
          return prev.filter(
            (p) => !(p.userId === userId && p.permission === permission)
          );
        } else {
          // Add new permission if it does not exist
          return [...prev, { userId, permission }];
        }
      });
    },
    [users]
  );

  // Check if a permission is selected
  const isChecked = (userId, permission) => {
    const user = users.find((u) => u._id === userId);
    if (user?.role === "Super Admin") return true;

    return selectedPermissions.some(
      (p) => p.userId === userId && p.permission === permission
    );
  };

  // Save the selected permissions
  const handleSavePermissions = async () => {
    try {
      const response = await axios.post(
        "https://formx360.onrender.com/permissions/save",
        {
          formId: form._id,
          permissions: selectedPermissions,
        }
      );
      toast.success("Permissions saved successfully!");
      await fetchForms(companyId); // Fetch updated forms after saving
      handleClose();
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Failed to save permissions.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-semibold">
          Manage Permissions: <i>{form?.title}</i>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <ListGroup variant="flush">
          {users.map((user) => (
            <ListGroup.Item
              key={user._id}
              className="d-flex flex-column flex-md-row justify-content-between align-items-md-center py-3 border-bottom"
            >
              <div className="mb-2 mb-md-0">
                <strong>
                  {user.firstName} {user.lastName}
                </strong>{" "}
                <Badge bg="light" text="dark" className="ms-2">
                  {user.role}
                </Badge>
              </div>
              <div className="d-flex gap-3 flex-wrap">
                <Form.Check
                  label={
                    <FaWpforms
                      title="Can Submit Form"
                      style={{ marginTop: "5px" }}
                    />
                  }
                  checked={isChecked(user._id, "view")}
                  onChange={() => handleCheckboxChange(user._id, "view")}
                  disabled={user.role === "Super Admin" || !canEditPermissions}
                  className="d-flex align-items-center gap-1"
                />
                <Form.Check
                  label={<FaEdit title="Can Edit" />}
                  checked={isChecked(user._id, "edit")}
                  onChange={() => handleCheckboxChange(user._id, "edit")}
                  disabled={user.role === "Super Admin" || !canEditPermissions}
                  className="d-flex align-items-center gap-1"
                />
                <Form.Check
                  label={<FaTrash title="Can Delete" />}
                  checked={isChecked(user._id, "delete")}
                  onChange={() => handleCheckboxChange(user._id, "delete")}
                  disabled={user.role === "Super Admin" || !canEditPermissions}
                  className="d-flex align-items-center gap-1"
                />
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSavePermissions}
          disabled={!canEditPermissions}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PermissionsModal;
