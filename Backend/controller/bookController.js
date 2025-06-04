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
        const [userResult] = await db.query("SELECT * FROM users WHERE prn = ?", [prn]);
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
        console.log("Updating available copies for book ID:", bookId); // Debugging line
        await db.query("UPDATE book SET Available_Copies = Available_Copies - 1 WHERE BOOK_ID = ?", [bookId]);
        console.log("Update completed of available books");

        return res.json({ message: 'Book issued successfully' });

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// Return the book
exports.returnBook = async (req, res) => {
  const { issueId } = req.params;

  try {
    // Step 1: Update Return_Date
    const [updateResult] = await db.execute(
      "UPDATE issuedbooks SET Return_Date = NOW() WHERE Issue_ID = ? AND Return_Date IS NULL",
      [issueId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ message: 'Book not issued or already returned' });
    }

    // Step 2: Get BOOK_ID
    const [rows] = await db.execute(
      "SELECT BOOK_ID FROM issuedbooks WHERE Issue_ID = ?",
      [issueId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Issued book record not found' });
    }

    const bookId = rows[0].BOOK_ID;

    // Step 3: Update Available_Copies
    const [updateCopiesResult] = await db.execute(
      "UPDATE book SET Available_Copies = Available_Copies + 1 WHERE BOOK_ID = ?",
      [bookId]
    );

    if (updateCopiesResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error("Error returning book:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
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
        SELECT 
            SUM(b.Total_Copies) - IFNULL(SUM(ib.issued_count), 0) AS Available,
            IFNULL(SUM(ib.issued_count), 0) AS Issued
        FROM book b
        LEFT JOIN (
            SELECT Book_ID, COUNT(*) AS issued_count
            FROM issuedbooks
            WHERE Return_Date IS NULL
            GROUP BY Book_ID
        ) ib ON b.Book_ID = ib.Book_ID
    `;

    try {
        const [results] = await db.query(query);
        const row = results[0] || { Available: 0, Issued: 0 };
        console.log("Book status counts:", row); // Debugging line

        res.json({
            Available: row.Available,
            Issued: row.Issued
        });
    } catch (error) {
        console.error("Error fetching book status counts:", error);
        res.status(500).json({ message: "Server error" });
    }
};

//// AND DATEDIFF(CURDATE(), ib.Issue_Date) > 0

// displaying category 
exports.getBookCategories = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT COUNT(DISTINCT Category) AS categoryCount FROM book"
    );
    res.json({ count: results[0].categoryCount });
    console.log("Query results:", results); // Add this line to inspect what MySQL is returning

  } catch (error) {
    console.error("Error fetching category count:", error);
    res.status(500).json({ error: "Database error" });
  }
};
// Get all categories books
exports.getBooksPerCategory = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT Category, COUNT(*) AS bookCount 
      FROM book 
      GROUP BY Category
    `);

    res.json({ categories: results });
  } catch (error) {
    console.error("Error fetching books per category:", error);
    res.status(500).json({ error: "Database error" });
  }
};



