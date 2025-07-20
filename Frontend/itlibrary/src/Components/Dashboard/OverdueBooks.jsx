import React, { useEffect, useState } from 'react';
import { getPendingBooks } from '../../api'; // Replace with actual API call
import './OverdueBooks.css';

export default function OverdueBooks() {
    const [overdueBooks, setOverdueBooks] = useState([]);

    useEffect(() => {
        fetchOverdueBooks();
    }, []);

    const fetchOverdueBooks = async () => {
        try {
            const data = await getPendingBooks(); // Call to your backend
            setOverdueBooks(data);
        } catch (error) {
            console.error("Error fetching overdue books:", error);
        }
    };

    return (
        <div className="overdue-books">
            <div className="overdue-card">
                <h2>Books Not Returned <span className="highlight">(Over 15 Days)</span></h2>
                {overdueBooks.length > 0 ? (
                    <div className="table-container">
                        <table className="book-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Student Name</th>
                                    <th>PRN</th>
                                    <th>Days Overdue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overdueBooks.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.title}</td>
                                        <td>{entry.category}</td>
                                        <td>{entry.studentName}</td>
                                        <td>{entry.prn}</td>
                                        <td>{entry.DaysSinceIssue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="no-data">No books are overdue by more than 15 days 🎉</p>
                )}
            </div>
        </div>
    );
}
