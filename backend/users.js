const express = require("express");
const db = require("./db");
const { bcrypt, generateToken, authenticateToken } = require("./auth");

const router = express.Router();

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.run("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [username, email, hash], function(err){
    if(err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, username, email });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if(err || !user) return res.status(401).json({ error: "Invalid credentials" });
    if(bcrypt.compareSync(password, user.password_hash)){
      const token = generateToken(user);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

router.get("/me/reviews", authenticateToken, (req, res) => {
  db.all(
    `SELECT reviews.*, products.name as product_name
     FROM reviews 
     JOIN products ON products.id = reviews.product_id
     WHERE user_id = ?`, [req.user.id],
    (err, rows) => {
      if(err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

router.delete("/me/reviews/:id", authenticateToken, (req, res) => {
  db.run("DELETE FROM reviews WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], function(err){
    if(err) return res.status(500).json({ error: err.message });
    if(this.changes === 0) return res.status(404).json({ error: "Review not found or not yours" });
    res.json({ success: true });
  });
});

router.put("/me/reviews/:id", authenticateToken, (req, res) => {
  const { rating, review_text } = req.body;
  db.run("UPDATE reviews SET rating = ?, review_text = ? WHERE id = ? AND user_id = ?", 
    [rating, review_text, req.params.id, req.user.id], function(err){
      if(err) return res.status(500).json({ error: err.message });
      if(this.changes === 0) return res.status(404).json({ error: "Review not found or not yours" });
      res.json({ success: true });
    });
});

module.exports = router;