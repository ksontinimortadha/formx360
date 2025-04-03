import React, { useState } from "react";
import NavbarComponent from "./NavbarComponent";
import Sidebar from "./Sidebar";
import { Button, Card, Container, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddReportModal from "../modals/AddReportModal";

function Reports() {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  return (
    <>
      <NavbarComponent />
      <div style={{ height: "100vh", display: "flex" }}>
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <Container>
            <Row className="mb-4">
              <Card className="shadow-sm border-0 rounded-4 w-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>Reports Management</h4>
                    <Button variant="primary" onClick={handleShowAddModal}>
                      <FaPlus /> Add Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Row>
          </Container>
          <AddReportModal
            show={showAddModal}
            handleClose={handleCloseAddModal}
          />
        </main>
      </div>
    </>
  );
}

export default Reports;
