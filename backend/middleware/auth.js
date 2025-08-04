const jwt = require("jsonwebtoken");
const JWT_SECRET = "mysecretkey";

// function verifyToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: "Token required" });

//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });
//     req.user = user;
//     next();
//   });
// }

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




module.exports = verifyToken;
