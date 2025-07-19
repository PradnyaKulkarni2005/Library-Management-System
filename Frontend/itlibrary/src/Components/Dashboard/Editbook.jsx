import React, { useState, useEffect } from "react";
import { updateBook, getBooks } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import "./EditBook.css";

const EditBook = () => {
  const { bookId } = useParams(); // bookId from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    book_id: bookId,
    isbn: "",
    title: "",
    author: "",
    publication: "",
    available_copies: "",
    total_copies: "",
    category: "",
    originalIsbn: "",
  });

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const response = await getBooks();

      const bookList = response?.data || response?.book || [];
      const book = bookList.find((b) => String(b.book_id || b.Book_ID) === String(bookId));

      console.log("bookId from URL:", bookId);
      console.log("bookList:", bookList);
      console.log("matched book:", book);

      if (book) {
        setFormData({
          book_id: book.book_id,
          isbn: book.isbn || "",
          title: book.title || "",
          author: book.author || "",
          publication: book.publication || "",
          available_copies: Number(book.available_copies ||  0),
          total_copies: Number(book.total_copies || 0),
          category: book.category ||  "",
          originalIsbn: book.isbn ||  "",
        });
      } else {
        console.error("Book not found");
      }
    } catch (error) {
      console.error("Error fetching book:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };
      delete updatedData.book_id;

      console.log("Submitting updateBook:", updatedData);

      await updateBook(updatedData);
      alert("Book updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating book: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="edit-book-container">
      <h2 className="edit-book-title">Update Book</h2>
      <form onSubmit={handleSubmit} className="edit-book-form">
        <input
          className="form-input"
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={formData.isbn}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="publication"
          placeholder="Publication"
          value={formData.publication}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="number"
          name="available_copies"
          placeholder="Available Copies"
          value={formData.available_copies}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="number"
          name="total_copies"
          placeholder="Total Copies"
          value={formData.total_copies}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
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
