import React, { useState } from "react";
import { uploadBooksExcel, uploadStudentsExcel } from "../../../api";
import "./ExcelUpload.css";
import Swal from "sweetalert2";

export default function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [uploadType, setUploadType] = useState("books"); // default option
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
      let res;
      if (uploadType === "books") {
        res = await uploadBooksExcel(file);
        Swal.fire({
          icon: 'success',
          title: 'Books Uploaded',
          text: `✅ Inserted ${res.inserted} books successfully`,
        });
        
      } else {
        res = await uploadStudentsExcel(file);
          Swal.fire({
            icon: 'success',
            title: 'Students Uploaded',
            text: `✅ Inserted ${res.inserted} students successfully`,
          });
        
      }
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
      <h2>Upload Excel</h2>

    
      <label htmlFor="uploadType">Choose upload type:</label>
      <select
        id="uploadType"
        value={uploadType}
        onChange={(e) => setUploadType(e.target.value)}
      >
        <option value="books">Books</option>
        <option value="students">Students</option>
      </select>

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
