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
            console.log("Books response:", res);
            // Only show books with available copies
            setBooks(res);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleIssue = async () => {
      console.log("Issue button clicked!");
      console.log("Selected Student:", selectedStudent);
      console.log("Selected Book:", selectedBook);
  
      if (!selectedStudent || !selectedBook) {
          alert("Please select both student and book.");
          return;
      }
  
      try {
          console.log("Sending API call...");
          const response = await issueBook(selectedBook, selectedStudent);
          console.log("API Response:", response);
  
          alert("Book issued successfully!");
  
          setSelectedStudent('');
          setSelectedBook('');
          fetchBooks();
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
                        <option key={student.PRN} value={student.PRN}>
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
