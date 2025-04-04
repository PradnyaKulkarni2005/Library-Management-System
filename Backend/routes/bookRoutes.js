const express = require('express');
const { getBooks, addBook,updateBook,deleteBook,issueBook } = require('../controller/bookController');
const router = express.Router();
// Books route
router.get('/get', getBooks);
router.post('/add', addBook);
router.post('/update', updateBook);
router.delete('/delete/:bookId', deleteBook);
router.post('/issue', issueBook);
module.exports = router;