// Load product details and reviews
async function loadProduct(productId) {
  const response = await fetch(`/api/products/${productId}`);
  const product = await response.json();

  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-description").textContent = product.description;
  document.getElementById("review-count").textContent = `${product.reviewCount} reviews`;

  document.getElementById("overall-rating").textContent = `Overall: ${renderStars(product.overallRating)} (${product.overallRating.toFixed(1)})`;

  const averagesList = document.getElementById("average-ratings");
  averagesList.innerHTML = "";
  for (const [category, rating] of Object.entries(product.averages)) {
    const li = document.createElement("li");
    li.textContent = `${category}: ${renderStars(rating)} (${rating.toFixed(1)})`;
    averagesList.appendChild(li);
  }

  loadReviews(productId);

  document.getElementById("sort-reviews").addEventListener("change", (e) => {
    loadReviews(productId, e.target.value);
  });

  // Initialize star inputs for review form
  setupStarInputs();
}

// Load reviews for a product
async function loadReviews(productId, sort = "newest") {
  const response = await fetch(`/api/products/${productId}/reviews?sort=${sort}`);
  const reviews = await response.json();

  const reviewList = document.getElementById("review-list");
  reviewList.innerHTML = "";

  reviews.forEach(review => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${review.username}</strong> (${new Date(review.created_at).toLocaleDateString()}):<br>
    ${review.textReview}<br>
    Quality: ${renderStars(review.quality)}<br>
    Value: ${renderStars(review.value)}<br>
    Usability: ${renderStars(review.usability)}<br>
    Design: ${renderStars(review.design)}<br>
    Support: ${renderStars(review.support)}<br>`;
    reviewList.appendChild(li);
  });
}

// Render star ratings
function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "⭐" : "☆";
  }
  return stars;
}

// ⭐ Setup star rating selectors
function setupStarInputs() {
  const categories = ["quality", "value", "usability", "design", "support"];

  categories.forEach(cat => {
    const container = document.querySelector(`.stars[data-category="${cat}"]`);
    if (!container) return;

    container.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.textContent = "⭐";
      star.classList.add("star");
      star.dataset.value = i;

      star.addEventListener("click", () => {
        // Clear all stars first
        container.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));

        // Highlight clicked stars
        for (let j = 1; j <= i; j++) {
          container.querySelector(`.star[data-value="${j}"]`).classList.add("selected");
        }

        container.dataset.rating = i; // store rating
      });

      container.appendChild(star);
    }
  });
}

// ⭐ Review form submission
document.getElementById("review-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const review = {
    username: document.getElementById("username").value,
    textReview: document.getElementById("textReview").value,
    quality: document.querySelector('.stars[data-category="quality"]').dataset.rating || 0,
    value: document.querySelector('.stars[data-category="value"]').dataset.rating || 0,
    usability: document.querySelector('.stars[data-category="usability"]').dataset.rating || 0,
    design: document.querySelector('.stars[data-category="design"]').dataset.rating || 0,
    support: document.querySelector('.stars[data-category="support"]').dataset.rating || 0,
    product_id: productId
  };

  const response = await fetch(`/api/products/${productId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review)
  });

  if (response.ok) {
    loadReviews(productId);
    e.target.reset();
    setupStarInputs(); // reset stars after submission
  }
});
