import React, { useState } from "react";
import { addBook } from "../../api";
import { useNavigate } from "react-router-dom";
import "./AddBook.css"; // Importing the CSS

const AddBook = () => {
  const [formData, setFormData] = useState({
    ISBN: "",
    Title: "",
    Author: "",
    Publication: "",
    Available_Copies: "",
    Total_Copies: "",
    Category: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBook(formData);
      alert("Book added successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error adding book: " + error.message);
    }
  };

  return (
    <div className="add-book-container">
      <h2 className="add-book-title">Add New Book</h2>
      <form className="add-book-form" onSubmit={handleSubmit}>
        <input type="text" name="ISBN" className="form-input" placeholder="ISBN" onChange={handleChange} required />
        <input type="text" name="Title" className="form-input" placeholder="Title" onChange={handleChange} required />
        <input type="text" name="Author" className="form-input" placeholder="Author" onChange={handleChange} required />
        <input type="text" name="Publication" className="form-input" placeholder="Publication" onChange={handleChange} required />
        <input type="number" name="Available_Copies" className="form-input" placeholder="Available Copies" onChange={handleChange} required />
        <input type="number" name="Total_Copies" className="form-input" placeholder="Total Copies" onChange={handleChange} required />
        <input type="text" name="Category" className="form-input" placeholder="Category" onChange={handleChange} required />
        <button type="submit" className="form-submit-btn">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
