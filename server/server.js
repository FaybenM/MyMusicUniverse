const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Example mock data
const artists = [
  { id: 1, name: "Artist 1" },
  { id: 2, name: "Artist 2" },
  { id: 3, name: "Artist 3" },
];

// Route for /api/artists
app.get("/api/artists", (req, res) => {
  res.json(artists); // Send the mock data as JSON
});

app.get("/", (req, res) => {
  res.send("My Music Universe API is running...");
});

const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
