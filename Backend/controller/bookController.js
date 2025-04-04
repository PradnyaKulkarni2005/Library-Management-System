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
exports.issueBook = (req, res) => {
    const { bookId, userId } = req.body;

    // check if the user exists
    db.query("SELECT * FROM USERS WHERE USER_ID = ?", [userId], (err, userresult) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err });
        }
        if (userresult.length === 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // check if the book is available
        db.query("SELECT Available_Copies FROM BOOK WHERE BOOK_ID = ?", [bookId], (err, bookResults) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: err });
            }

            if (bookResults.length === 0) {
                return res.status(400).json({ message: 'Book does not exist' });
            }

            if (bookResults[0].Available_Copies > 0) {
                // issue the book
                db.query("INSERT INTO IssuedBooks (BOOK_ID, USER_ID) VALUES (?, ?)", [bookId, userId], (err, result) => {
                    if (err) {
                        console.error("Database Error:", err);
                        return res.status(500).json({ error: err });
                    }

                    // update the available copies
                    db.query("UPDATE BOOK SET Available_Copies = Available_Copies - 1 WHERE BOOK_ID = ?", [bookId], (err, result) => {
                        if (err) {
                            console.error("Database Error:", err);
                            return res.status(500).json({ error: err });
                        }
                        res.json({ message: 'Book issued successfully' });
                    });
                });
            } else {
                res.status(400).json({ message: 'Book is not available' });
            }
        });
    });
};

// Return the book
exports.returnBook = (req, res) => {
    const {issueId} = req.params;
    //upadate the issued book table

    db.query("UPDATE IssuedBooks SET Return_Date = NOW() WHERE Issue_ID = ? AND Return_Date IS NULL"), [issueId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Book not issued or already returned' });
        }

        // update the available copies in the book table
        db.query("UPDATE BOOK SET Available_Copies = Available_Copies + 1 WHERE BOOK_ID = (SELECT BOOK_ID FROM IssuedBooks WHERE Issue_ID = ?)", [issueId], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: err });
            }
            res.json({ message: 'Book returned successfully' });
        });
    }
};
