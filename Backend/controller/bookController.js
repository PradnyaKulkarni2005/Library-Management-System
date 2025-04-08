const db = require('../config/db');

// Handling the get request for books
exports.getBooks = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM Book');
        console.log("Fetched Books:", result); // Debugging line
        res.json(result);
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: error });
    }
};

// Handling the add request for books
exports.addBook = async (req, res) => { 
    const { ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO Book (ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category]
        );
        res.json({ message: 'Book added successfully', bookId: result.insertId });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: error });
    }
};
exports.updateBook = async (req, res) => { 
    const { ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category } = req.body;
    try {
        const result = await db.query(
            "UPDATE Book SET Title = ?, Author = ?, Publication = ?, Available_Copies = ?, Total_Copies = ?, Category = ? WHERE ISBN = ?",
            [Title, Author, Publication, Available_Copies, Total_Copies, Category, ISBN] ,
            (err, result) => {  
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ error: err });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Book not found' });
                }
                res.json({ message: 'Book updated successfully' });
            }
        );
        res.json({ message: 'Book added successfully', bookId: result.insertId });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: error });
    }
};
//delete book
exports.deleteBook = async (req, res) => {
    const { bookId } = req.params;
    try {
        const result = await db.query(
            "DELETE FROM Book WHERE Book_ID = ?",
            [bookId],
            (err, result) => {  
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ error: err });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Book not found' });
                }
                res.json({ message: 'Book deleted successfully' });
            }
        );
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: error });
    }
}
// issue book
exports.issueBook = async (req, res) => {
    const { bookId, prn } = req.body;

    try {
        // 1. Check if user exists
        console.log("PRN:", prn); // Debugging line
        console.log("Book ID:", bookId); // Debugging line
        const [userResult] = await db.query("SELECT * FROM Users WHERE prn = ?", [prn]);
        console.log("User Result:", userResult); // Debugging line
        if (userResult.length === 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // 2. Check if book is available
        const [bookResults] = await db.query("SELECT Available_Copies FROM BOOK WHERE BOOK_ID = ?", [bookId]);

        if (bookResults.length === 0) {
            return res.status(400).json({ message: 'Book does not exist' });
        }
        console.log(bookResults[0].Available_Copies)
        if (bookResults[0].Available_Copies <= 0) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // 3. Issue the book
        await db.query("INSERT INTO IssuedBooks (BOOK_ID,prn) VALUES (?, ?)", [bookId, prn]);

        // 4. Update available copies
        await db.query("UPDATE BOOK SET Available_Copies = Available_Copies - 1 WHERE BOOK_ID = ?", [bookId]);

        return res.json({ message: 'Book issued successfully' });

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// Return the book
exports.returnBook = (req, res) => {
    const { issueId } = req.params;

    // Update the IssuedBooks table to set the Return_Date
    db.query("UPDATE IssuedBooks SET Return_Date = NOW() WHERE Issue_ID = ? AND Return_Date IS NULL", [issueId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Book not issued or already returned' });
        }

        // Update the available copies in the Book table
        db.query("UPDATE BOOK SET Available_Copies = Available_Copies + 1 WHERE BOOK_ID = (SELECT BOOK_ID FROM IssuedBooks WHERE Issue_ID = ?)", [issueId], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: err });
            }
            res.json({ message: 'Book returned successfully' });
        });
    });
};
// Fetch issued books by PRN where Return_Date is NULL
exports.fetchIssuedBooksByPrn = async (req, res) => {
    const prn = req.params.prn;
    console.log("Fetching issued books for PRN:", prn); // Debugging line

    const query = `
        SELECT ib.Issue_ID, ib.Book_ID, b.Title, b.Author, ib.Issue_Date
        FROM IssuedBooks ib
        JOIN Book b ON ib.Book_ID = b.Book_ID
        WHERE ib.prn = ? AND ib.Return_Date IS NULL
    `;

    try {
        const result = await db.query(query, [prn]);
        console.log("Query result:", result); // Debugging line
        res.json(result);
    } catch (error) {
        console.error("Error fetching issued books:", error); // Debugging line
        return res.status(500).json({ error: "Internal server error" });
    }
};
//most issued books 
exports.getMostIssuedBooks = async(req, res) => {
    console.log("Fetching most issued books..."); // Debugging line
    const query = `
        SELECT b.Book_ID, b.Title, b.Author, COUNT(ib.Book_ID) AS issue_count
        FROM IssuedBooks ib
        JOIN Book b ON ib.Book_ID = b.Book_ID
        GROUP BY ib.Book_ID
        ORDER BY issue_count DESC
        LIMIT 10;
    `;

    try {
        const [result] = await db.query(query); // Use promise-based query
        console.log("Most issued books:", result); // Debugging line
        res.json(result);
    } catch (error) {
        console.error("Error fetching most issued books:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

