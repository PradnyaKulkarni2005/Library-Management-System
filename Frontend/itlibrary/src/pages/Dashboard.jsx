import React, { useEffect, useState } from 'react';
import { getBooks } from '../api';
import './Dashboard.css'; 

export default function Dashboard() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const booksData = await getBooks();
            console.log("Books API Response:", booksData);
            setBooks(booksData);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Books Available</h2>
            <table className="book-table">
                <thead>
                    <tr>
                        <th>Sr.no</th>
                        
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.Book_ID}>
                            <td>{book.Book_ID}</td>
                            <td>{book.Title}</td>
                            <td>{book.Category}</td>
                            <td>{book.Author}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
