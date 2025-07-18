import express from 'express';
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
  fetchIssuedBooksByPrn,
  getMostIssuedBooks,
  searchBooks,
  getPendingBooks,
  getBookStatusCounts,
  getBookCategories,
  getBooksPerCategory
} from '../controller/bookController.js';

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
router.post("/return/:issueId", returnBook);
// Fetch Issued Books by PRN route
router.get("/issued/:prn", fetchIssuedBooksByPrn);
// Get Most Issued Books route
router.get('/mostissued', getMostIssuedBooks);
//search book
router.get('/search', searchBooks);
//get pending books which are not returned
router.get('/pending', getPendingBooks);
router.get('/status',getBookStatusCounts);
router.get('/categories', getBookCategories);
// Get Books Per Category route
router.get('/percat', getBooksPerCategory);


export default router;
