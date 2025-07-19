import React, { useState } from "react";
import { updateStudent, getStudents } from "../../../api";
import "../EditBook.css";
import Swa from "sweetalert2";

const UpdateStudent = () => {
  const [prnInput, setPrnInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    prn: "",
    department: "",
    email: "",
  });
  const [studentFound, setStudentFound] = useState(false);

  const handlePRNSearch = async () => {
    try {
      const response = await getStudents(); // Get all students
      const student = response.find((s) => s.prn === prnInput.trim());

      if (student) {
        setFormData({
          name: student.name,
          prn: student.prn,
          department: student.department,
          email: student.email,
        });
        setStudentFound(true);
      } else {
        
        Swa.fire({
          icon: "error",
          title: "Not Found",
          text: "Student with this PRN not found.",
        });
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
     
      Swa.fire({
        icon: "success",
        title: "Success",
        text: "Student updated successfully!",
      });
      setStudentFound(false);
      setPrnInput("");
      setFormData({ name: "", prn: "", department: "", email: "" });
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
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            type="text"
            name="Department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            type="email"
            name="Email"
            placeholder="College Email-id"
            value={formData.email}
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
