import React, { useState, useEffect } from "react";
import { updateBook, getBooks } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import "./EditBook.css"; // Importing the CSS

const EditBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Book_ID: bookId,
    Title: "",
    Author: "",
    Publication: "",
    Available_Copies: "",
    Total_Copies: "",
    Category: "",
  });

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const response = await getBooks();
      console.log("API Response:", response);

      if (!response || !response.book) {
        console.error("Error: API response does not contain 'book' key.");
        return;
      }

      const book = response.book.find((b) => b.Book_ID == bookId);
      if (book) {
        setFormData(book);
      } else {
        console.error("Error: Book not found in the list.");
      }
    } catch (error) {
      console.error("Fetch Book Details Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBook(formData);
      alert("Book updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error updating book: " + error.message);
    }
  };

  return (
    <div className="edit-book-container">
      <h2 className="edit-book-title">Update Book</h2>
      <form onSubmit={handleSubmit} className="edit-book-form">
        <input
          className="form-input"
          type="text"
          name="Title"
          placeholder="Title"
          value={formData.Title}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="Author"
          placeholder="Author"
          value={formData.Author}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="Publication"
          placeholder="Publication"
          value={formData.Publication}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="number"
          name="Available_Copies"
          placeholder="Available Copies"
          value={formData.Available_Copies}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="number"
          name="Total_Copies"
          placeholder="Total Copies"
          value={formData.Total_Copies}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="Category"
          placeholder="Category"
          value={formData.Category}
          onChange={handleChange}
          required
        />
        <button type="submit" className="form-submit-btn">
          Update Book
        </button>
      </form>
    </div>
  );
};

export default EditBook;
