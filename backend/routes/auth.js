const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db"); // We'll create this DB connection module

const JWT_SECRET =  "mysecretkey";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Auth header:", authHeader);

  if (!authHeader) return res.status(401).json({ error: "Token required" });

  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT verify error:", err.message);
      return res.status(403).json({ error: "Invalid token" });
    }

    console.log("Decoded token:", user);
    req.user = user;
    next();
  });
}


// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Signup successful" });
  });
});

// Signin
router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  });
});




// /routes/auth.js
router.get("/user", verifyToken, (req, res) => {
  const { id } = req.user; // assume verifyToken adds req.user
  console.log("User ID received:", req.user.id);

  db.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(404).json({ error: "User not found" });
      res.json(results[0]);
    }
  );
});
router.get("/test-token", verifyToken, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});



module.exports = router;
