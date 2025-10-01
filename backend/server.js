const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Database connection
const db = new sqlite3.Database(path.join(__dirname, 'database', 'reviews.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});

// Get reviews for a product
app.get('/api/products/:id/reviews', (req, res) => {
  const productId = req.params.id;
  db.all('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [productId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add a new review
app.post('/api/products/:id/reviews', (req, res) => {
  const productId = req.params.id;
  const { username, text, ratings } = req.body;

  db.run(
    'INSERT INTO reviews (product_id, username, text, ratings, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
    [productId, username, text, JSON.stringify(ratings)],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
