import React, { useState, useEffect } from 'react';
import { getBooks, issueBook } from '../../api';
import './IssueBook.css';

export default function IssueBook() {
    const [prn, setprn] = useState('');
    const [showBooks, setShowBooks] = useState(false);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (showBooks) {
            fetchBooks();
        }
    }, [showBooks]);

    const fetchBooks = async () => {
        try {
            const response = await getBooks();
            setBooks(response);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        }
    };

    const handleIssue = async (bookId) => {
        if (!prn) {
            alert("Please enter student PRN number.");
            return;
        }

        try {
            await issueBook(prn, bookId);
            alert(`Book ID ${bookId} issued to PRN No ${prn}`);
            setShowBooks(false);
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to issue book.";
            alert(msg);
        }
    };

    return (
        <div className="issue-book-container">
            <h2 className="issue-title">Issue a Book</h2>

            <div className="prn-input-group">
                <label htmlFor="prn">Enter Student PRN:</label>
                <input 
                    type="text" 
                    id="prn"
                    value={prn} 
                    onChange={(e) => setprn(e.target.value)} 
                    placeholder="Eg. 123B1F001"
                    className="prn-input"
                />
            </div>

            <button 
                onClick={() => setShowBooks(!showBooks)} 
                className="toggle-book-btn"
            >
                {showBooks ? "Hide Book List" : "Select Book"}
            </button>

            {showBooks && (
                <div className="book-table-container">
                    <h3 className="book-table-title">Available Books</h3>
                    <table className="book-table">
                        <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book.Book_ID}>
                                    <td>{book.Book_ID}</td>
                                    <td>{book.Title}</td>
                                    <td>{book.Author}</td>
                                    <td>{book.Category}</td>
                                    <td>
                                        <button 
                                            className="issue-btn"
                                            onClick={() => handleIssue(book.Book_ID)}
                                        >
                                            Issue
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
