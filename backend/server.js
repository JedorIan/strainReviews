const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const userRoutes = require("./users");
const reviewRoutes = require("./reviews");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/products", reviewRoutes);

db.serialize(() => {
  db.run("INSERT OR IGNORE INTO products (id, name, description) VALUES (1, 'Widget 3000', 'A cool product')");
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const accountRoutes = require('./account');
app.use('/account', accountRoutes);
