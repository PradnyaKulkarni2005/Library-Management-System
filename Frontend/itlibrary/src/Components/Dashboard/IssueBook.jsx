import React, { useState, useEffect } from 'react';
import { getBooks, issueBook } from '../../api'; // Make sure you have these API functions

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
            alert("Please enter student roll number.");
            return;
        }

        try {
            await issueBook(prn, bookId); // Make sure API matches this
            alert(`Book ID ${bookId} issued to PRN No ${prn}`);
            setShowBooks(false); // Hide book list after issue
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to issue book.";
            alert(msg);
            
        }
    };

    return (
        <div className="issue-container">
            <h2>Issue a Book</h2>
            
            <div>
                <label>Enter Student PRN:</label>
                <input 
                    type="text" 
                    value={prn} 
                    onChange={(e) => setprn(e.target.value)} 
                    placeholder="Eg. 123B1F001"
                />
            </div>

            <button onClick={() => setShowBooks(!showBooks)}>
                {showBooks ? "Hide Book List" : "Select Book"}
            </button>

            {showBooks && (
                <div className="book-table">
                    <h3>Available Books</h3>
                    <table border="1" cellPadding="10">
                        <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Issue</th>
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
                                        <button onClick={() => handleIssue(book.Book_ID)}>Issue</button>
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
