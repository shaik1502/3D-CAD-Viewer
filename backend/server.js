const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5120;

// Enable CORS
app.use(cors());




// Serve static files
app.use(express.static("uploads"));

// Set up storage for uploaded files
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});


// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Get all uploaded files
app.get("/files", (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) return res.status(500).json({ error: "Failed to read files" });
    res.json({ files });
  });
});

// Upload a file
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});


// Download a file
app.get("/models/:filename", (req, res) => {
  const filePath = path.join(uploadFolder, req.params.filename);
  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: "File not found" });
  res.sendFile(filePath);
});

// Delete a file
app.delete("/models/:filename", (req, res) => {
  const filePath = path.join(uploadFolder, req.params.filename);
  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: "File not found" });

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete file" });
    res.json({ message: "File deleted successfully" });
  });
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
