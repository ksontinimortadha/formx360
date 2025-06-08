import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import exportUtilsReport from "./exportUtilsReport";

const ExportReport = ({
  showModal,
  setShowModal,
  reportData,
  availableFields, 
}) => {
  const handleExport = (format) => {
    const headers = availableFields.map((field) => field.label); 

    switch (format) {
      case "csv":
        exportUtilsReport.exportToCSV(reportData, headers);
        break;
      case "excel":
        exportUtilsReport.exportToExcel(reportData, headers);
        break;
      case "pdf":
        exportUtilsReport.exportToPDF(reportData, headers);
        break;
      default:
        break;
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Export Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {reportData?.length > 0 ? (
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="bg-primary text-white">
              <tr>
                {reportData[0].responses.map((response, index) => (
                  <th key={index}>{response.field_name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((entry, rowIndex) => (
                <tr key={rowIndex}>
                  {entry.responses.map((response, colIndex) => (
                    <td key={colIndex}>{response.value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No data found based on your filters.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={() => handleExport("csv")}>
          <FaFileCsv style={{ marginRight: "8px" }} />
          Export to CSV
        </Button>
        <Button variant="outline-success" onClick={() => handleExport("excel")}>
          <FaFileExcel style={{ marginRight: "8px" }} />
          Export to Excel
        </Button>
        <Button variant="outline-danger" onClick={() => handleExport("pdf")}>
          <FaFilePdf style={{ marginRight: "8px" }} />
          Export to PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportReport;
