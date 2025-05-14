import React, { useState } from 'react';
import { fetchIssuedBooksByPrn, returnBook } from '../../api';
import './ReturnBook.css';

export default function ReturnBook() {
    const [prn, setPrn] = useState('');
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFetchIssuedBooks = async () => {
        if (!prn) {
            alert("Please enter a valid PRN.");
            return;
        }
        setLoading(true);
        try {
            const books = await fetchIssuedBooksByPrn(prn);
            const flatBooks = Array.isArray(books[0]) ? books[0] : books;
            setIssuedBooks(flatBooks);
        } catch (error) {
            console.error("Failed to fetch issued books:", error);
            alert("Error fetching issued books");
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (issueId) => {
        if (window.confirm("Confirm return of this book?")) {
            try {
                await returnBook(issueId);
                alert("Book returned successfully!");
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
