import React, { useEffect, useState } from 'react';
import { getBooks, getStudents, issueBook } from '../../api';
// import './IssueBook.css'; 

export default function IssueBook() {
    const [students, setStudents] = useState([]);
    const [books, setBooks] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedBook, setSelectedBook] = useState('');

    useEffect(() => {
        fetchStudents();
        fetchBooks();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await getStudents(); // Should return array of students
            setStudents(res);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const fetchBooks = async () => {
        try {
            const res = await getBooks();
            // Only show books with available copies
            const availableBooks = res.filter(book => book.Available_Copies > 0);
            setBooks(availableBooks);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleIssue = async () => {
        if (!selectedStudent || !selectedBook) {
            alert("Please select both student and book.");
            return;
        }

        try {
            await issueBook({ studentId: selectedStudent, bookId: selectedBook });
            alert("Book issued successfully!");

            // Reset form
            setSelectedStudent('');
            setSelectedBook('');
            fetchBooks(); // update available books
        } catch (error) {
            console.error("Error issuing book:", error);
            alert("Failed to issue book.");
        }
    };

    return (
        <div className="issue-book-container">
            <h2>Issue a Book</h2>

            <div className="form-group">
                <label>Select Student:</label>
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                    <option value="">-- Select Student --</option>
                    {students.map((student) => (
                        <option key={student.Student_ID} value={student.Student_ID}>
                            {student.Name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Select Book:</label>
                <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
                    <option value="">-- Select Book --</option>
                    {books.map((book) => (
                        <option key={book.Book_ID} value={book.Book_ID}>
                            {book.Title} by {book.Author}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleIssue}>Issue Book</button>
        </div>
    );
}
