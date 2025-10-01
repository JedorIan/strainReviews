
const express = require('express');
const router = express.Router();
const db = require('./db');

// Get current user's reviews
router.get('/reviews', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  try {
    const reviews = await db.all(
      'SELECT * FROM reviews WHERE userId = ?',
      [req.session.user.id]
    );
    res.json({ user: req.session.user, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a review
router.put('/reviews/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  const { id } = req.params;
  const { quality, value, usability, design, support, textReview } = req.body;
  try {
    const review = await db.get('SELECT * FROM reviews WHERE id = ?', [id]);
    if (!review || review.userId !== req.session.user.id) {
      return res.status(403).json({ error: 'Not your review' });
    }
    await db.run(
      `UPDATE reviews 
       SET quality=?, value=?, usability=?, design=?, support=?, textReview=? 
       WHERE id=?`,
      [quality, value, usability, design, support, textReview, id]
    );
    res.json({ success: true, message: 'Review updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a review
router.delete('/reviews/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  const { id } = req.params;
  try {
    const review = await db.get('SELECT * FROM reviews WHERE id = ?', [id]);
    if (!review || review.userId !== req.session.user.id) {
      return res.status(403).json({ error: 'Not your review' });
    }
    await db.run('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
