import React from "react";
import { Nav } from "react-bootstrap";

function TemplateNavBar({ categories, selectedCategory, onChange }) {
  return (
    <Nav justify variant="tabs" activeKey={selectedCategory}>
      {categories.map((category) => (
        <Nav.Item key={category}>
          <Nav.Link eventKey={category} onClick={() => onChange(category)}>
            {category}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

export default TemplateNavBar;
