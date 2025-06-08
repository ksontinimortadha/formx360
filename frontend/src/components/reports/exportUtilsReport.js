import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Export to CSV function
const exportToCSV = (data, headers, filename = "report.csv") => {
  const csvRows = [];

  // Dynamically generate header labels
  const headerLabels = headers.map((fieldId) => {
    const fieldData = data[0].responses.find((r) => r.field_id === fieldId);
    return fieldData ? fieldData.field_name : fieldId; 
  });
  csvRows.push(headerLabels.join(","));

  // Build CSV rows dynamically
  data.forEach((item) => {
    const values = headers.map((fieldId) => {
      const fieldData = item.responses.find((r) => r.field_name === fieldId);
      const value = fieldData ? fieldData.value : "N/A";
      return `"${value}"`; 
    });
    csvRows.push(values.join(","));
  });

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
};

// Export to Excel function
const exportToExcel = (data, headers, filename = "report.xlsx") => {
  // Flatten data based on headers
  const flattenedData = data.map((item) => {
    const row = {};
    headers.forEach((fieldId) => {
      const fieldData = item.responses.find((r) => r.field_name === fieldId);
      const label = fieldData ? fieldData.field_name : fieldId; 
      row[label] = fieldData ? fieldData.value : "N/A";
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, filename);
};

// Export to PDF function
const exportToPDF = (data, headers, filename = "report.pdf") => {
  const doc = new jsPDF();

  const rows = data.map((item) =>
    headers.map((fieldId) => {
      const fieldData = item.responses.find((r) => r.field_name === fieldId);
      return fieldData ? fieldData.value : "N/A";
    })
  );

  const headerLabels = headers.map((fieldId) => {
    const fieldData = data[0].responses.find((r) => r.field_id === fieldId);
    return fieldData ? fieldData.field_name : fieldId; 
  });

  // Generate table in PDF using jsPDF's autoTable
  autoTable(doc, {
    head: [headerLabels],
    body: rows,
    theme: "grid",
    headStyles: { fillColor: [0, 123, 255] },
  });

  doc.save(filename);
};

export default { exportToCSV, exportToExcel, exportToPDF };
