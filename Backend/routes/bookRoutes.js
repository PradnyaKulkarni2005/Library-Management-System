const express = require('express');
const { getBooks, addBook } = require('../controller/bookController');
const router = express.Router();
// Books route
router.get('/get', getBooks);
router.post('/add', addBook);
module.exports = router;