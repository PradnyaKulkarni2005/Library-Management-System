import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook } from '../../api'; 
// import './AvailableBooks.css'; 

export default function AvailableBooks() {
    const [books, setBooks] = useState([]);

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

    return (
        <div className="available-books">
            <h2>Books Available</h2>
            <table className="book-table">
                <thead>
                    <tr>
                        <th>Sr.no</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.Book_ID}>
                            <td>{book.Book_ID}</td>
                            <td>{book.Title}</td>
                            <td>{book.Category}</td>
                            <td>{book.Author}</td>
                            <td><button onClick={() => handleDelete(book.Book_ID)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
