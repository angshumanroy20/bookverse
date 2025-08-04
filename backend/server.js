// /backend/server.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./db");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("backend/uploads"));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

const bookmarkRoutes = require("./routes/bookmarks");
app.use("/api/bookmarks", bookmarkRoutes);

const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);


app.use("/api/users", require("./routes/dashboard")); // assuming dashboard.js is in routes/



// Sample Route
app.get("/api/books", (req, res) => {
  const sql = "SELECT id, title, author, genre, cover FROM books";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// // Get book by ID
app.get("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const sql = "SELECT * FROM books WHERE id = ?";
  db.query(sql, [bookId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "Book not found" });
    res.json(results[0]);
  });
});

// Get all reviews for a book
// Get all reviews for a book
app.get("/api/reviews/:bookId", (req, res) => {
  const bookId = req.params.bookId;

  const sql = `
    SELECT reviews.*, users.name AS user_name 
    FROM reviews 
    JOIN users ON reviews.user_id = users.id 
    WHERE book_id = ?
    ORDER BY reviews.created_at DESC
  `;

  db.query(sql, [bookId], (err, results) => {
    if (err) {
      console.error("Error loading reviews:", err);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }

    res.json(results);
  });
});

// Add or update a review
app.post("/api/reviews", (req, res) => {
  const { user_id, book_id, rating, comment } = req.body;
  const checkSql = "SELECT * FROM reviews WHERE user_id = ? AND book_id = ?";
  db.query(checkSql, [user_id, book_id], (err, results) => {
    if (results.length > 0) {
      const updateSql =
        "UPDATE reviews SET rating = ?, comment = ?, created_at = NOW() WHERE user_id = ? AND book_id = ?";
      db.query(updateSql, [rating, comment, user_id, book_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Review updated" });
      });
    } else {
      const insertSql =
        "INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)";
      db.query(insertSql, [user_id, book_id, rating, comment], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Review added" });
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
