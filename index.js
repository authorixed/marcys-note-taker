const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "develop/public")));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "develop/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./develop/db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Failed to read notes" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };

  fs.readFile("./develop/db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return res.status(500).json({ error: "Failed to read notes" });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(
      "./develop/db/db.json",
      JSON.stringify(notes, null, 2),
      (err) => {
        if (err) {
          console.error("Failed to save note:", err);
          return res.status(500).json({ error: "Failed to save note" });
        }

        res.json(newNote);
      }
    );
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "develop/public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
