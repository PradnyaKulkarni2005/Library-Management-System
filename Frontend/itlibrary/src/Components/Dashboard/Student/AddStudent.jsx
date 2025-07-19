import React, { useState } from "react";
import { addStudent } from "../../../api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../AddBook.css"; 


const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    prn: "",
    department: "",
    email: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStudent(formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Student added successfully!",
        });
      navigate("/dashboard");
    } catch (error) {
      alert("Error adding book: " + error.message);
    }
  };

  return (
    <div className="add-book-container">
      <h2 className="add-book-title">Add New Student</h2>
      <form className="add-book-form" onSubmit={handleSubmit}>
        <input type="text" name="name" className="form-input" placeholder="Student Name" onChange={handleChange} required />
        <input type="text" name="prn" className="form-input" placeholder="PRN" onChange={handleChange} required />
        <input type="text" name="department" className="form-input" placeholder="Department" onChange={handleChange} required />
        <input type="email" name="email" className="form-input" placeholder="College Email-id" onChange={handleChange} required />
        
        <button type="submit" className="form-submit-btn">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
