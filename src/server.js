const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "notes_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

// HTML routes
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/:id", (req, res) => {
  res.sendFile(path.join(publicDir, "note.html"));
});

// API routes
app.get("/api/notes", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, content, updated_at AS updatedAt FROM notes ORDER BY updated_at DESC"
    );
    const notes = rows;
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { title = "Untitled note", content = "" } = req.body || {};
    const [result] = await pool.execute(
      "INSERT INTO notes (title, content) VALUES (?, ?)",
      [title, content]
    );
    const insertId = result.insertId;
    const [rows] = await pool.query(
      "SELECT id, title, content, updated_at AS updatedAt FROM notes WHERE id = ?",
      [insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create note" });
  }
});

app.get("/api/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }
  try {
    const [rows] = await pool.query(
      "SELECT id, title, content, updated_at AS updatedAt FROM notes WHERE id = ?",
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }
  const { title, content } = req.body || {};
  try {
    const [result] = await pool.execute(
      "UPDATE notes SET title = ?, content = ?, updated_at = NOW() WHERE id = ?",
      [title, content, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    const [rows] = await pool.query(
      "SELECT id, title, content, updated_at AS updatedAt FROM notes WHERE id = ?",
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update note" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }
  try {
    const [result] = await pool.execute("DELETE FROM notes WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

