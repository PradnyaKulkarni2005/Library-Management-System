import React, { useEffect, useState } from 'react';
import { getPendingBooks } from '../../api'; // Replace with actual API call
// import './OverdueBooks.css'; // Optional for styling

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
            <h2>Books Not Returned (15+ Days)</h2>
            {overdueBooks.length > 0 ? (
                <table className="book-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Student Name</th>
                            <th>PRN</th>
                            <th>Days Since Issue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overdueBooks.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.Title}</td>
                                <td>{entry.Category}</td>
                                <td>{entry.StudentName}</td>
                                <td>{entry.PRN}</td>
                                <td>{entry.DaysSinceIssue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No books overdue by more than 15 days.</p>
            )}
        </div>
    );
}
