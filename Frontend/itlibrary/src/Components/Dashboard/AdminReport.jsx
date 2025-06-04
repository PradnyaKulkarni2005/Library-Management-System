import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MostIssuedBooks from "./MostIssuedbook";
import OverdueBooks from "./OverdueBooks";
import BooksStatus from "./Analysis";
import CategoryCount from "./CategoryCount";
import BooksPerCat from "./BooksPerCat"; // Assuming this is your component

import "./AdminReport.css"; // Make sure to create and import this CSS file

const AdminReport = () => {
  const reportRef = useRef();

  const handleDownload = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("Admin_Report.pdf");
  };

  return (
    <div className="admin-report">
      <div className="admin-report-header">
        <h1>📊 Admin Report</h1>
        <button className="download-btn" onClick={handleDownload}>
          ⬇️ Download Report
        </button>
      </div>

      <div ref={reportRef}>
        <section className="report-content">
          <div className="card">
            <CategoryCount />
          </div>
          <div className="card">
            <BooksStatus />
          </div>
          <div className="card">
            <OverdueBooks />
          </div>
          <div className="card">
            <BooksPerCat />
          </div>
        </section>

        <section className="most-issued-section card">
          <MostIssuedBooks />
        </section>
      </div>
    </div>
  );
};

export default AdminReport;
