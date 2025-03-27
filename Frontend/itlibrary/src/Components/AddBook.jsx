import React, { useState } from "react";
import { addBook } from "../api";
import { useNavigate } from "react-router-dom";

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
      navigate("/dashboard"); // Redirect to dashboard after adding a book
    } catch (error) {
      alert("Error adding book: " + error.message);
    }
  };

  return (
    <div className="container">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="ISBN" placeholder="ISBN" onChange={handleChange} required />
        <input type="text" name="Title" placeholder="Title" onChange={handleChange} required />
        <input type="text" name="Author" placeholder="Author" onChange={handleChange} required />
        <input type="text" name="Publication" placeholder="Publication" onChange={handleChange} required />
        <input type="number" name="Available_Copies" placeholder="Available Copies" onChange={handleChange} required />
        <input type="number" name="Total_Copies" placeholder="Total Copies" onChange={handleChange} required />
        <input type="text" name="Category" placeholder="Category" onChange={handleChange} required />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
