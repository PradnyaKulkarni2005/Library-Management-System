import React, { useEffect, useState } from 'react';
import { getMostIssuedBooks } from '../../api';

export default function MostIssuedBooks() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchMostIssuedBooks();
    }, []);

    const fetchMostIssuedBooks = async () => {
        try {
            const data = await getMostIssuedBooks();
            setBooks(data);
        } catch (error) {
            console.error("Error fetching most issued books:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Most Issued Books</h2>
            <table className="book-table">
                <thead>
                    <tr>
                        <th>Sr. No</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Times Issued</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, index) => (
                        <tr key={book.Book_ID}>
                            <td>{index + 1}</td>
                            <td>{book.Title}</td>
                            <td>{book.Author}</td>
                            <td>{book.issue_count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
