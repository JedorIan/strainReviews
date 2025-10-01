
let selectedRatings = {
  quality: 0,
  value: 0,
  usability: 0,
  design: 0,
  support: 0
};

async function fetchReviews() {
  const response = await fetch('/reviews');
  const data = await response.json();

  // Display averages for each category
  const avgContainer = document.getElementById('average-rating');
  avgContainer.innerHTML = `
    <h2>Average Ratings</h2>
    <div>Quality: ${data.averages.quality}/5 ${renderStars(Math.round(data.averages.quality))}</div>
    <div>Value: ${data.averages.value}/5 ${renderStars(Math.round(data.averages.value))}</div>
    <div>Usability: ${data.averages.usability}/5 ${renderStars(Math.round(data.averages.usability))}</div>
    <div>Design: ${data.averages.design}/5 ${renderStars(Math.round(data.averages.design))}</div>
    <div>Support: ${data.averages.support}/5 ${renderStars(Math.round(data.averages.support))}</div>
  `;

  // Display each review with categories and text
  const reviewsList = document.getElementById('reviews-list');
  reviewsList.innerHTML = '';
  data.reviews.forEach(review => {
    const div = document.createElement('div');
    div.className = 'review';
    div.innerHTML = `
      <strong>${review.username}</strong><br>
      Quality: ${renderStars(review.quality)}<br>
      Value: ${renderStars(review.value)}<br>
      Usability: ${renderStars(review.usability)}<br>
      Design: ${renderStars(review.design)}<br>
      Support: ${renderStars(review.support)}<br>
      <p>${review.textReview || ""}</p>
    `;
    reviewsList.appendChild(div);
  });
}

function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<span class="star filled">&#9733;</span>';
    } else {
      stars += '<span class="star">&#9733;</span>';
    }
  }
  return stars;
}

function setupStarInputs() {
  const categories = ['quality', 'value', 'usability', 'design', 'support'];
  categories.forEach(cat => {
    const container = document.getElementById(`stars-${cat}`);
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.innerHTML = '&#9733;';
      star.dataset.value = i;
      star.addEventListener('click', () => {
        selectedRatings[cat] = i;
        updateStarDisplay(cat);
      });
      container.appendChild(star);
    }
  });
}

function updateStarDisplay(category) {
  const container = document.getElementById(`stars-${category}`);
  const stars = container.querySelectorAll('.star');
  stars.forEach(star => {
    if (parseInt(star.dataset.value) <= selectedRatings[category]) {
      star.classList.add('filled');
    } else {
      star.classList.remove('filled');
    }
  });
}

document.getElementById('review-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const textReview = document.getElementById('textReview').value;

  const reviewData = { username, ...selectedRatings, textReview };

  await fetch('/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });

  // Refresh reviews
  fetchReviews();
  document.getElementById('review-form').reset();
  selectedRatings = { quality: 0, value: 0, usability: 0, design: 0, support: 0 };
  setupStarInputs();
});

document.addEventListener('DOMContentLoaded', () => {
  fetchReviews();
  setupStarInputs();
});
