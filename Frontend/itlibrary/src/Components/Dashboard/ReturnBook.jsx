import React, { useState } from 'react';
import { fetchIssuedBooksByPrn, returnBook } from '../../api';
import Swa from 'sweetalert2';
import './ReturnBook.css';

export default function ReturnBook() {
    const [prn, setPrn] = useState('');
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFetchIssuedBooks = async () => {
        if (!prn) {
           
            Swa.fire({
                icon: 'warning',
                title: 'PRN Required',
                text: 'Please enter a valid PRN number to fetch issued books.'
            });
            return;
        }
        setLoading(true);
        try {
            const books = await fetchIssuedBooksByPrn(prn);
            const flatBooks = Array.isArray(books[0]) ? books[0] : books;
            setIssuedBooks(flatBooks);
        } catch (error) {
            
            
            Swa.fire({
                icon: 'error',
                title: 'Fetch Failed',
                text: error.response?.data?.message || "Failed to fetch issued books."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (issueId) => {
        if (window.confirm("Confirm return of this book?")) {
            try {
                await returnBook(issueId);
                
                Swa.fire({
                    icon: 'success',
                    title: 'Book Returned',
                    text: `Book with Issue ID ${issueId} has been successfully returned.`
                });
                setIssuedBooks(prev => prev.filter(book => book.Issue_ID !== issueId));
            } catch (error) {
                console.error("Error returning book:", error);
                alert("Failed to return book");
            }
        }
    };

    return (
        <div className="return-book-container">
            <h2>Return Issued Books</h2>

            <div className="form-group">
                <input
                    type="text"
                    value={prn}
                    onChange={(e) => setPrn(e.target.value)}
                    placeholder="Enter PRN"
                />
                <button onClick={handleFetchIssuedBooks} disabled={loading}>
                    {loading ? "Loading..." : "Fetch Issued Books"}
                </button>
            </div>

            {issuedBooks.length > 0 && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Title</th>
                                <th>Issue Date</th>
                                <th>Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issuedBooks.map((book, index) => (
                                <tr key={book.Issue_ID || index}>
                                    <td>{book.Book_ID}</td>
                                    <td>{book.Title || "N/A"}</td>
                                    <td>{book.Issue_Date?.substring(0, 10)}</td>
                                    <td>
                                        <button className="return-btn" onClick={() => handleReturn(book.Issue_ID)}>
                                            Return
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {issuedBooks.length === 0 && !loading && prn && (
                <p className="no-books">No books issued to this PRN.</p>
            )}
        </div>
    );
}
