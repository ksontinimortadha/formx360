import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const PermissionsModal = ({ show, handleClose, form, users, onSave }) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const handleCheckboxChange = (userId, permission) => {
    setSelectedPermissions((prev) => {
      const index = prev.findIndex(
        (p) => p.userId === userId && p.permission === permission
      );

      if (index > -1) {
        return prev.filter(
          (p) => !(p.userId === userId && p.permission === permission)
        );
      } else {
        return [...prev, { userId, permission }];
      }
    });
  };

  const isChecked = (userId, permission) =>
    selectedPermissions.some(
      (p) => p.userId === userId && p.permission === permission
    );

  const handleSave = () => {
    onSave(form._id, selectedPermissions);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-semibold">
          <span className="me-2">🔐</span>Manage Permissions —{" "}
          <i>{form?.title}</i>
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
                  label={<FaEye title="Can View" />}
                  checked={isChecked(user._id, "view")}
                  onChange={() => handleCheckboxChange(user._id, "view")}
                  className="d-flex align-items-center gap-1"
                />
                <Form.Check
                  label={<FaEdit title="Can Edit" />}
                  checked={isChecked(user._id, "edit")}
                  onChange={() => handleCheckboxChange(user._id, "edit")}
                  className="d-flex align-items-center gap-1"
                />
                <Form.Check
                  label={<FaTrash title="Can Delete" />}
                  checked={isChecked(user._id, "delete")}
                  onChange={() => handleCheckboxChange(user._id, "delete")}
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
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PermissionsModal;
