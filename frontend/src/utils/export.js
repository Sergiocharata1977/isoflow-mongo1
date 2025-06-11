
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportToPDF = (data, title, columns) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(16);
  doc.text(title, 20, 20);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Table
  const tableData = data.map(item => columns.map(col => item[col.key]));
  
  doc.autoTable({
    startY: 40,
    head: [columns.map(col => col.header)],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 'auto' }
    },
    margin: { top: 40 }
  });
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToExcel = (data, title, columns) => {
  const ws = XLSX.utils.json_to_sheet(
    data.map(item => {
      const row = {};
      columns.forEach(col => {
        row[col.header] = item[col.key];
      });
      return row;
    })
  );
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportData = (data, title, columns, format = 'pdf') => {
  switch (format.toLowerCase()) {
    case 'pdf':
      exportToPDF(data, title, columns);
      break;
    case 'excel':
      exportToExcel(data, title, columns);
      break;
    default:
      throw new Error(`Formato no soportado: ${format}`);
  }
};
