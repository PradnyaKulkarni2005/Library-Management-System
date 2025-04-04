const express = require('express');
const { getBooks, addBook,updateBook,deleteBook,issueBook } = require('../controller/bookController');
const router = express.Router();
// Get Books route
router.get('/get', getBooks);
// Add Book route
router.post('/add', addBook);
// Update Book route
router.post('/update', updateBook);
// Delete Book route
router.delete('/delete/:bookId', deleteBook);
// Issue Book route
router.post('/issue', issueBook);
// Return Book route
router.post("/book/return/:issueId", returnBook);
module.exports = router;
