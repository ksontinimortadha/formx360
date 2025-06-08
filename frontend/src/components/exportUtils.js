import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportToCSV = (data, headers, filename = "responses.csv") => {
  const csvRows = [];

  // Get header labels using the first item
  const headerLabels = headers.map((field) => {
    const fieldData = data[0].responses.find((r) => r.field_id === field);
    return fieldData ? fieldData.field_name : field;
  });
  csvRows.push(headerLabels.join(","));

  // Build CSV rows
  data.forEach((item) => {
    const values = headers.map((field) => {
      const fieldData = item.responses.find((r) => r.field_id === field);
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

const exportToExcel = (data, headers, filename = "responses.xlsx") => {
  // Flatten the data based on the headers
  const flattenedData = data.map((item) => {
    const row = {};
    headers.forEach((field) => {
      const fieldData = item.responses.find((r) => r.field_id === field);
      const label = fieldData ? fieldData.field_name : field;
      row[label] = fieldData ? fieldData.value : "N/A";
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, filename);
};

const exportToPDF = (data, headers, filename = "responses.pdf") => {
  const doc = new jsPDF();

  const rows = data.map((item) =>
    headers.map((field) => {
      const fieldData = item.responses.find((r) => r.field_id === field);
      return fieldData ? fieldData.value : "N/A";
    })
  );

  const headerLabels = headers.map((field) => {
    const fieldData = data[0].responses.find((r) => r.field_id === field);
    return fieldData ? fieldData.field_name : field;
  });

  // Use standalone autoTable function
  autoTable(doc, {
    head: [headerLabels],
    body: rows,
    theme: "grid",
    headStyles: { fillColor: [0, 123, 255] },
  });

  doc.save(filename);
};

export default { exportToCSV, exportToExcel, exportToPDF };
