import React from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportButton = ({ data = [], fileName = "ExportedData.xlsx", sheetName = "Sheet1" }) => {
  
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Convert JSON to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate excel file and trigger download
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);
  };

  return (
    <button 
      onClick={exportToExcel}
      className="bg-blue-600 text-white px-4 py-2 mx-2 hover:bg-blue-700 transition-colors flex items-center "
    >
      <Download className="w-4 h-4 mr-2" />
      Export
    </button>
  );
};

export default ExportButton;
