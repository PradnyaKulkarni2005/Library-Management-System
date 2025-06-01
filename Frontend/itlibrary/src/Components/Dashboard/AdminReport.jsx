import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MostIssuedBooks from "./MostIssuedbook";
import OverdueBooks from "./OverdueBooks";
import BooksStatus from "./Analysis";

const AdminReport = () => {
  const reportRef = useRef();

  const handleDownload = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("Admin_Report.pdf");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📊 Admin Report</h1>
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ⬇️ Download Report
        </button>
      </div>

      <div ref={reportRef}>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BooksStatus />
          <OverdueBooks />
        </section>

        <section className="mt-6">
          <MostIssuedBooks />
        </section>
      </div>
    </div>
  );
};

export default AdminReport;
