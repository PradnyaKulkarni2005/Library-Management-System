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
