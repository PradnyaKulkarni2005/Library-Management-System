import React, { useState } from 'react';
import { fetchIssuedBooksByPrn, returnBook } from '../../api'; // Ensure this is correctly defined

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
            console.log("Fetched books:", flatBooks);
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
                console.log("Returning book with Issue ID:", issueId);
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
            <div>
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
                <table className="book-table">
                    <thead>
                        <tr>
                            <th>Book ID</th>
                            <th>Title</th>
                            <th>Issue Date</th>
                            <th>Return</th>
                        </tr>
                    </thead>
                    <tbody>
                    {issuedBooks.map((book, index) => {
    console.log("Book:", book); // Debugging
    return (
        <tr key={book.Issue_ID || index}>
            <td>{book.Book_ID}</td>
            <td>{book.Title || "N/A"}</td>
            <td>{book.Issue_Date?.substring(0, 10)}</td>
            <td>
                <button onClick={() => handleReturn(book.Issue_ID)}>Return</button>
            </td>
        </tr>
    );
})}

                    </tbody>
                </table>
            )}

            {issuedBooks.length === 0 && !loading && prn && (
                <p>No books issued to this PRN.</p>
            )}
        </div>
    );
}
