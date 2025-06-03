import React from "react";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "./logo.png";

function HomeNavbar() {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm py-2">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            width="130"
            height="20"
            className="d-inline-block align-top"
            alt="FormX360"
            style={{ margin: "10px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {/* Features Menu */}
            <NavDropdown title="Features" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to="/form-builder-features">
                Form Builder
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/share-forms">
                Share Forms
              </NavDropdown.Item>
              
            </NavDropdown>

            {/* Solutions Menu with Nested Dropdown */}
            <NavDropdown title="Solutions" id="navbarScrollingDropdown">
              <div className="dropdown position-relative industry-dropdown">
                <NavDropdown.Item
                  as="div"
                  className="dropdown-toggle"
                  id="industry-dropdown"
                  data-bs-toggle="dropdown"
                >
                  By Industry
                </NavDropdown.Item>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#industry-1">
                      Industry 1
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#industry-2">
                      Industry 2
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#industry-3">
                      Industry 3
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown position-relative industry-dropdown">
                <NavDropdown.Item
                  as="div"
                  className="dropdown-toggle"
                  id="industry-dropdown"
                  data-bs-toggle="dropdown"
                >
                  By Size
                </NavDropdown.Item>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#Size-1">
                      Size 1
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#Size-2">
                      Size 2
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#Size-3">
                      Size 3
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown position-relative industry-dropdown">
                <NavDropdown.Item
                  as="div"
                  className="dropdown-toggle"
                  id="industry-dropdown"
                  data-bs-toggle="dropdown"
                >
                  By Role
                </NavDropdown.Item>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#Role-1">
                      Role 1
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#Role-2">
                      Role 2
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#Role-3">
                      Role 3
                    </a>
                  </li>
                </ul>
              </div>
            </NavDropdown>
          </Nav>

          <Form className="d-flex">
            <Link to="/users/register">
              <Button variant="primary" className="me-2 register-button">
                Register
              </Button>
            </Link>
            <Link to="/users/login">
              <Button variant="outline-primary" className="login-button">
                Login
              </Button>
            </Link>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HomeNavbar;
