const express = require('express');
const { getBooks, addBook,updateBook } = require('../controller/bookController');
const router = express.Router();
// Books route
router.get('/get', getBooks);
router.post('/add', addBook);
router.post('/update', updateBook);

module.exports = router;