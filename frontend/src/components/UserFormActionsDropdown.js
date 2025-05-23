import React from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserFormActionsDropdown = ({ form, hasPermission }) => {
  const navigate = useNavigate();

  const handleResponses = (form) => {
    navigate(`/responses/form/${form._id}`);
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
        <Dropdown.Item onClick={() => handleResponses(form)}>
          View Responses
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserFormActionsDropdown;
