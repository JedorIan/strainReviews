
DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    quality INTEGER NOT NULL,
    value INTEGER NOT NULL,
    usability INTEGER NOT NULL,
    design INTEGER NOT NULL,
    support INTEGER NOT NULL,
    textReview TEXT
);
