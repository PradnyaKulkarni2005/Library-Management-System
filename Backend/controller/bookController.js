const db = require('../config/db');

// Handling the get request for books
exports.getBooks = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM book');
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
            "INSERT INTO book (ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category) VALUES (?, ?, ?, ?, ?, ?, ?)", 
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
            "UPDATE book SET Title = ?, Author = ?, Publication = ?, Available_Copies = ?, Total_Copies = ?, Category = ? WHERE ISBN = ?",
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
            "DELETE FROM book WHERE Book_ID = ?",
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
        const [bookResults] = await db.query("SELECT Available_Copies FROM book WHERE BOOK_ID = ?", [bookId]);

        if (bookResults.length === 0) {
            return res.status(400).json({ message: 'Book does not exist' });
        }
        console.log(bookResults[0].Available_Copies)
        if (bookResults[0].Available_Copies <= 0) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // 3. Issue the book
        await db.query("INSERT INTO issuedbooks (BOOK_ID,prn) VALUES (?, ?)", [bookId, prn]);

        // 4. Update available copies
        await db.query("UPDATE book SET Available_Copies = Available_Copies - 1 WHERE BOOK_ID = ?", [bookId]);

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
    db.query("UPDATE issuedbooks SET Return_Date = NOW() WHERE Issue_ID = ? AND Return_Date IS NULL", [issueId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Book not issued or already returned' });
        }

        // Update the available copies in the Book table
        db.query("UPDATE book SET Available_Copies = Available_Copies + 1 WHERE BOOK_ID = (SELECT BOOK_ID FROM issuedbooks WHERE Issue_ID = ?)", [issueId], (err, result) => {
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
        FROM issuedbooks ib
        JOIN book b ON ib.Book_ID = b.Book_ID
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
        FROM issuedbooks ib
        JOIN book b ON ib.Book_ID = b.Book_ID
        GROUP BY ib.Book_ID
        ORDER BY issue_count DESC
        LIMIT 5;
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

// GET /api/book/search?title=Harry&author=Rowling&category=Fiction
exports.searchBooks = async (req, res) => {
    const { title, author, category, isbn, available } = req.query;

    let conditions = [];
    let values = [];

    if (title) {
        conditions.push("Title LIKE ?");
        values.push(`%${title}%`);
    }
    if (author) {
        conditions.push("Author LIKE ?");
        values.push(`%${author}%`);
    }
    if (category) {
        conditions.push("Category LIKE ?");
        values.push(`%${category}%`);
    }
    if (isbn) {
        conditions.push("ISBN = ?");
        values.push(isbn);
    }
    if (available === "true") {
        conditions.push("Available_Copies > 0");
    }

    let query = "SELECT * FROM book";
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    try {
        const [result] = await db.query(query, values);
        res.status(200).json(result);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Failed to search books" });
    }
};

// pending return of the books
// Get all books not returned and overdue by 15+ days
exports.getPendingBooks = async (req, res) => {
    const query = `
        SELECT 
            b.Title,
            b.Category,
            s.Name AS StudentName,
            s.prn AS PRN,
            DATEDIFF(CURDATE(), ib.Issue_Date) AS DaysSinceIssue
        FROM 
            issuedbooks ib
        JOIN 
            book b ON ib.Book_Id = b.Book_ID
        JOIN 
            users s ON ib.prn = s.prn
        WHERE 
            ib.Return_Date IS NULL 
            AND DATEDIFF(CURDATE(), ib.Issue_Date) > 15
    `;

    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error("Error fetching overdue books:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
//reminder for the books using email
exports.getReminderUsers = async (req, res) => {
    const query = `
        SELECT 
            s.Name,
            s.email,
            b.Title,
            DATEDIFF(CURDATE(), ib.Issue_Date) AS DaysSinceIssue
        FROM 
            issuedbooks ib
        JOIN 
            book b ON ib.Book_Id = b.Book_ID
        JOIN 
            users s ON ib.prn = s.prn
        WHERE 
            ib.Return_Date IS NULL 
            AND DATEDIFF(CURDATE(), ib.Issue_Date) > 10
    `;

    try {
        const [results] = await db.promise().query(query);
        res.json(results);
    } catch (err) {
        console.error("Error fetching reminder users:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
//analysis of available and issued books
exports.getBookStatusCounts = async (req, res) => {
    const query = `
        SELECT 'Available' AS status, COUNT(*) AS count
        FROM book
        WHERE Book_ID NOT IN (
            SELECT Book_ID FROM issuedbooks WHERE Return_Date IS NULL
        )
        UNION ALL
        SELECT 'Issued' AS status, COUNT(*) AS count
        FROM issuedbooks
        WHERE Return_Date IS NULL
    `;

    try {
        const [results] = await db.query(query);  // Destructure if using mysql2 or wrapped db
        const counts = { Available: 0, Issued: 0 };

        results.forEach(row => {
            counts[row.status] = row.count;
        });

        res.json(counts);
    } catch (error) {
        console.error("Error fetching book status counts:", error);
        res.status(500).json({ message: "Server error" });
    }
};
