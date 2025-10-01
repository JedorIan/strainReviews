
const express = require('express');
const router = express.Router();
const db = require('./db');

// Fetch all reviews with averages for each category
router.get('/', async (req, res) => {
  try {
    const reviews = await db.all('SELECT username, quality, value, usability, design, support, textReview FROM reviews');
    const avgRow = await db.get(`
      SELECT 
        AVG(quality) as avgQuality,
        AVG(value) as avgValue,
        AVG(usability) as avgUsability,
        AVG(design) as avgDesign,
        AVG(support) as avgSupport
      FROM reviews
    `);

    const averages = {
      quality: avgRow.avgQuality ? parseFloat(avgRow.avgQuality).toFixed(1) : 0,
      value: avgRow.avgValue ? parseFloat(avgRow.avgValue).toFixed(1) : 0,
      usability: avgRow.avgUsability ? parseFloat(avgRow.avgUsability).toFixed(1) : 0,
      design: avgRow.avgDesign ? parseFloat(avgRow.avgDesign).toFixed(1) : 0,
      support: avgRow.avgSupport ? parseFloat(avgRow.avgSupport).toFixed(1) : 0
    };

    res.json({ reviews, averages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a review
router.post('/', async (req, res) => {
  const { username, quality, value, usability, design, support, textReview } = req.body;
  try {
    await db.run(
      'INSERT INTO reviews (username, quality, value, usability, design, support, textReview) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, quality, value, usability, design, support, textReview]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
