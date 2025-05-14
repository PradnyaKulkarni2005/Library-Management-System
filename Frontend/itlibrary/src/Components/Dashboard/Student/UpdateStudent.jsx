import React, { useState } from "react";
import { updateStudent, getStudents } from "../../../api";
import "../EditBook.css";

const UpdateStudent = () => {
  const [prnInput, setPrnInput] = useState("");
  const [formData, setFormData] = useState({
    Name: "",
    PRN: "",
    Department: "",
    Email: "",
  });
  const [studentFound, setStudentFound] = useState(false);

  const handlePRNSearch = async () => {
    try {
      const response = await getStudents(); // Get all students
      const student = response.find((s) => s.prn === prnInput.trim());

      if (student) {
        setFormData({
          Name: student.Name,
          PRN: student.prn,
          Department: student.Department,
          Email: student.Email,
        });
        setStudentFound(true);
      } else {
        alert("Student with this PRN not found.");
        setStudentFound(false);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Error occurred while fetching student.");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(formData); // Includes PRN in request body
      alert("Student updated successfully!");
      setStudentFound(false);
      setPrnInput("");
      setFormData({ Name: "", PRN: "", Department: "", Email: "" });
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student.");
    }
  };

  return (
    <div className="edit-book-container">
      <h2 className="edit-book-title">Update Student</h2>

      {/* Step 1: Enter PRN */}
      <div className="edit-book-form">
        <input
          className="form-input"
          type="text"
          placeholder="Enter PRN"
          value={prnInput}
          onChange={(e) => setPrnInput(e.target.value)}
        />
        <button type="button" className="form-submit-btn" onClick={handlePRNSearch}>
          Fetch Student
        </button>
      </div>

      {/* Step 2: Show form if student found */}
      {studentFound && (
        <form onSubmit={handleSubmit} className="edit-book-form">
          <input
            className="form-input"
            type="text"
            name="Name"
            placeholder="Student Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            type="text"
            name="Department"
            placeholder="Department"
            value={formData.Department}
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            type="email"
            name="Email"
            placeholder="College Email-id"
            value={formData.Email}
            onChange={handleChange}
            required
          />
          <button type="submit" className="form-submit-btn">
            Update Student
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateStudent;
