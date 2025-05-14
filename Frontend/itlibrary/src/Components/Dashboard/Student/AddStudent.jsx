import React, { useState } from "react";
import { addStudent } from "../../../api";
import { useNavigate } from "react-router-dom";
import "../AddBook.css"; 


const AddStudent = () => {
  const [formData, setFormData] = useState({
    Name: "",
    PRN: "",
    Department: "",
    Email: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStudent(formData);
      alert("Student added successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error adding book: " + error.message);
    }
  };

  return (
    <div className="add-book-container">
      <h2 className="add-book-title">Add New Student</h2>
      <form className="add-book-form" onSubmit={handleSubmit}>
        <input type="text" name="Name" className="form-input" placeholder="Student Name" onChange={handleChange} required />
        <input type="text" name="PRN" className="form-input" placeholder="PRN" onChange={handleChange} required />
        <input type="text" name="Department" className="form-input" placeholder="Department" onChange={handleChange} required />
        <input type="email" name="Email" className="form-input" placeholder="College Email-id" onChange={handleChange} required />
        
        <button type="submit" className="form-submit-btn">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
