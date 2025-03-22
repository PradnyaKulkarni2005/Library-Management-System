const db= require('../config/db');
//handling the get request for books
exports.getBooks = (req, res) => {
    db.query('SELECT * FROM book', (error, result) => {
        if (error) {
            return res.status(500).json({ error: error });
        }
        res.json(result);
    });
};
//handling the add request for books
exports.addBook = (req, res) => { 
    const { ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category } = req.body;
    db.query(
        "INSERT INTO Book (ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category) VALUES (?, ?, ?, ?,?,?,?)", [ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category], (error, result) => {
        if (error) {
            return res.status(500).json({ error: error });
        }
        res.json({ message: 'Book added successfully',bookId: result.insertId });
    });
}