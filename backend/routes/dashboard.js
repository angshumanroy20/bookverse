const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch uploaded books
router.get("/:userId/books", (req, res) => {
  const userId = req.params.userId;
  const booksQuery = "SELECT * FROM books WHERE uploaded_by = ?";
  db.query(booksQuery, [userId], (err, books) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(books);
  });
});

// Fetch bookmarks
router.get("/:userId/bookmarks", (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT books.*
    FROM bookmarks
    JOIN books ON bookmarks.book_id = books.id
    WHERE bookmarks.user_id = ?
  `;
  db.query(query, [userId], (err, bookmarks) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(bookmarks);
  });
});

// Fetch reviews
router.get("/:userId/reviews", (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT reviews.*, books.title AS book_title
    FROM reviews
    JOIN books ON reviews.book_id = books.id
    WHERE reviews.user_id = ?
  `;
  db.query(query, [userId], (err, reviews) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(reviews);
  });
});

module.exports = router;
