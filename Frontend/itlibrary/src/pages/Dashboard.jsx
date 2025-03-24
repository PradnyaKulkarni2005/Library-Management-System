import React , {useEffect, useState} from 'react'
import { getBooks } from '../api'
export default function Dashboard() {
    const [books,setBooks] = useState([]);
    useEffect(() => {
        fetchBooks();
    }, []);
    const fetchBooks = async () => {
        try {
            const booksData = await getBooks();
            console.log("Books API Response:", booksData);
            setBooks(booksData);  // Directly set the fetched array
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };
    
  return (
    <div>
        <h2>Library Dashboard</h2>
        <ul>
            {books.map(booksData => (
                    <li key={booksData.Book_ID}>{booksData.Title} - {booksData.Author}</li>
            ))}
        </ul>
    </div>
  )
}
