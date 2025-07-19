import React, { useState, useEffect } from 'react';
import Swa from 'sweetalert2';
import { getBooks, issueBook } from '../../api';
import './IssueBook.css';

export default function IssueBook() {
    const [prn, setprn] = useState('');
    const [showBooks, setShowBooks] = useState(false);
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 

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
            
            Swa.fire({
                icon: 'warning',
                title: 'PRN Required',
                text: 'Please enter a valid PRN number to issue a book.'
            });
            return;
        }

        try {
            await issueBook(prn, bookId);
            console.log('Request sent');
           
            Swa.fire({
                icon: 'success',
                title: 'Book Issued',
                text: `Book ID ${bookId} has been successfully issued to PRN No ${prn}.`
            });
            setShowBooks(false);
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to issue book.";
            alert(msg);
            Swa.fire({
                icon: 'error',
                title: 'Issue Failed',
                text: msg
            }); 
        }
    };

    // Filter books based on search query
const filteredBooks = searchQuery.trim() === ""
    ? books
    : books.filter(book =>
        (book.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (book.author?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (book.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );





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
                    {/* Search Input */}
                    <input 
                        type="text" 
                        placeholder="Search by Title, Author, or Category" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="search-input"
                    />

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
                            {filteredBooks.map((book, index) => (
    <tr key={book.Book_ID || book.book_id || index}>
        <td>{book.Book_ID || book.book_id}</td>
        <td>{book.title}</td>
        <td>{book.author}</td>
        <td>{book.category}</td>
        <td>
            <button 
                className="issue-btn"
                onClick={() => handleIssue(book.Book_ID || book.book_id)}
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
