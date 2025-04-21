import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";

const ExportModal = ({ show, handleClose, handleExport }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Export Responses</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Select the format you want to export the data in:</p>
        <div className="d-flex justify-content-around mt-4">
          <Button variant="outline-primary" onClick={() => handleExport("csv")}>
            <FaFileCsv style={{ marginRight: "8px" }} />
            CSV
          </Button>
          <Button
            variant="outline-success"
            onClick={() => handleExport("excel")}
          >
            <FaFileExcel style={{ marginRight: "8px" }} />
            Excel
          </Button>
          <Button variant="outline-danger" onClick={() => handleExport("pdf")}>
            <FaFilePdf style={{ marginRight: "8px" }} />
            PDF
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ExportModal;
