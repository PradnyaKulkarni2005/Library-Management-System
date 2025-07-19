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
            console.log("Fetched books:", booksData);
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
    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <tr key={book.book_id}>
            <td>{index + 1}</td>
            <td>{book.title}</td>
            <td>{book.category}</td>
            <td>{book.author}</td>
            <td>{book.available_copies}</td>
            <td>{book.total_copies}</td>
            <td>
                <button onClick={() => handleDelete(book.book_id)}>
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
