const express = require("express");
const router = express.Router();
const db = require("../db");

// Toggle Bookmark
router.post("/", (req, res) => {
  const { user_id, book_id } = req.body;

  const checkSql = "SELECT * FROM bookmarks WHERE user_id = ? AND book_id = ?";
  db.query(checkSql, [user_id, book_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      db.query(
        "DELETE FROM bookmarks WHERE user_id = ? AND book_id = ?",
        [user_id, book_id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Bookmark removed" });
        }
      );
    } else {
      db.query(
        "INSERT INTO bookmarks (user_id, book_id) VALUES (?, ?)",
        [user_id, book_id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Book bookmarked" });
        }
      );
    }
  });
});

// Get Bookmarked Books
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT books.* FROM books
    JOIN bookmarks ON books.id = bookmarks.book_id
    WHERE bookmarks.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
