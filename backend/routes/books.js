const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db");
const verifyToken = require("../middleware/auth");

// File Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload Book (Protected Route)
router.post(
  "/upload",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  (req, res) => {
    const { title, author, genre } = req.body;
    const cover = `/uploads/${req.files.cover[0].filename}`;
    const file_path = `/uploads/${req.files.file[0].filename}`;
    const uploaded_by = req.user.id; // ✅ Extracted from JWT

    const sql =
      "INSERT INTO books (title, author, genre, cover, file_path, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [title, author, genre, cover, file_path, uploaded_by],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Book uploaded successfully" });
      }
    );
  }
);

// Search books by title or author
router.get("/search", (req, res) => {
  const q = req.query.q || "";
  const searchTerm = `%${q}%`;
  const sql = "SELECT * FROM books WHERE title LIKE ? OR author LIKE ?";

  db.query(sql, [searchTerm, searchTerm], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ books: results });
  });
});

// Get all unique genres
router.get("/genres", (req, res) => {
  const sql = "SELECT DISTINCT genre FROM books WHERE genre IS NOT NULL";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const genres = results.map((row) => row.genre);
    res.json({ genres });
  });
});

// Filter by genre
router.get("/genre/:genre", (req, res) => {
  const { genre } = req.params;
  const sql = "SELECT * FROM books WHERE genre = ?";
  db.query(sql, [genre], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
