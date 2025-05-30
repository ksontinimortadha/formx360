import React from 'react'
import NavbarComponent from '../NavbarComponent';
import { Container, Navbar } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function NoResponses({ handleBackClick  }) {
  const navigate = useNavigate();

  return (
    <>
      <NavbarComponent />
      <Navbar className="bg-body-tertiary" style={{ marginBottom: "20px" }}>
        <Container>
          <Navbar.Brand style={{ fontWeight: "500" }}>
            <FaArrowLeft
              style={{ marginRight: "20px" }}
              size={20}
              color="darkgrey"
              onClick={handleBackClick}
            />
            Form Responses
          </Navbar.Brand>
          <Navbar.Toggle />
        </Container>
      </Navbar>
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-gray-500 mt-6">
          No responses found for this form.
        </p>
      </div>
    </>
  );
}

export default NoResponses