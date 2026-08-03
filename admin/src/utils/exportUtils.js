/**
 * Lightweight, dependency-free export helpers for the Reports module.
 *
 * - CSV export: works natively, opens correctly in Excel/Sheets.
 * - "Excel" export: same CSV content with a .xls-friendly MIME type — a
 *   pragmatic choice instead of pulling in a heavy library like SheetJS
 *   purely to produce a native .xlsx; the output opens correctly in Excel.
 * - PDF export: triggers the browser's native print dialog against a
 *   print-only view, letting the user "Save as PDF" — avoids bundling a
 *   client-side PDF rendering library for what is fundamentally a print job.
 *
 * If true native .xlsx/.pdf generation is required later, this is the file
 * to extend (e.g. swap in the `xlsx` and `jspdf` packages).
 */

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * @param {Array<Object>} rows - data rows
 * @param {Array<{key: string, label: string}>} columns - column definitions
 * @param {string} filename - without extension
 */
export const exportToCSV = (rows, columns, filename = "export") => {
  const header = columns.map((col) => escapeCsvValue(col.label)).join(",");
  const body = rows
    .map((row) => columns.map((col) => escapeCsvValue(row[col.key])).join(","))
    .join("\n");
  const csvContent = `${header}\n${body}`;

  downloadBlob(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;");
};

export const exportToExcel = (rows, columns, filename = "export") => {
  const header = columns.map((col) => escapeCsvValue(col.label)).join(",");
  const body = rows
    .map((row) => columns.map((col) => escapeCsvValue(row[col.key])).join(","))
    .join("\n");
  const csvContent = `${header}\n${body}`;

  downloadBlob(csvContent, `${filename}.xls`, "application/vnd.ms-excel");
};

const downloadBlob = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Opens the browser print dialog. Pair with a `print:` Tailwind stylesheet
 * on the report table so only the relevant content is included when the
 * user chooses "Save as PDF".
 */
export const exportToPDF = () => {
  window.print();
};
