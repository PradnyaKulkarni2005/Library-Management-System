import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook } from '../../api';
import './AvailableBooks.css';

export default function AvailableBooks() {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const booksData = await getBooks();
            setBooks(booksData);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleDelete = async (bookId) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await deleteBook(bookId);
                alert("Book deleted successfully");
                setBooks(books.filter(book => book.Book_ID !== bookId));
            } catch (error) {
                console.error("Error deleting book:", error);
            }
        }
    };

    const filteredBooks = books.filter(book =>
        book.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.Author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.Category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="available-books">
            <h2>Books Available</h2>
            <input
                type="text" className="search-input"
                placeholder="Search by Title, Author, or Category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <table className="book-table">
                <thead>
                    <tr>
                        <th>Sr.no</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Available Copies</th>
                        <th>Total Copies</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBooks.map((book, index) => (
                        <tr key={book.Book_ID}>
                            <td>{index + 1}</td>
                            <td>{book.Title}</td>
                            <td>{book.Category}</td>
                            <td>{book.Author}</td>
                            <td>{book.Available_Copies}</td>
                            <td>{book.Total_Copies}</td>
                            <td>
                                <button onClick={() => handleDelete(book.Book_ID)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
