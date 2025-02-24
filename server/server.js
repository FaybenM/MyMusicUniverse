const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
    res.send("My Music Universe API is running...");
});

// Artists Route (Temporary Example Data)
app.get("/api/artists", (req, res) => {
    const artists = [
        { id: 1, name: "Taylor Swift" },
        { id: 2, name: "Drake" },
        { id: 3, name: "Beyoncé" }
    ];
    res.json(artists);
});

const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
