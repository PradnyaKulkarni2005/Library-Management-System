import React, { useState } from "react";
import { uploadBooksExcel } from "../../../api";
import "./ExcelUpload.css";

export default function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select an Excel file first");
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await uploadBooksExcel(file);
      setMessage(`✅ Inserted ${res.inserted} books successfully`);
      setError(false);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="excel-upload">
      <h2>Upload Books Excel</h2>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleChange}
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`upload ${loading ? "disabled" : ""}`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {message && (
        <p className={`message ${error ? "error" : "success"}`}>{message}</p>
      )}
    </div>
  );
}
