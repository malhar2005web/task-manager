import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Path to the frontend dist folder
const frontendPath = path.join(__dirname, "..", "frontend", "dist");

// Check if frontend build exists and serve it
if (fs.existsSync(frontendPath)) {
    console.log("📁 Serving frontend from:", frontendPath);
    app.use(express.static(frontendPath));

    app.get("*all", (req, res) => {
        // If it's an API route that somehow leaked here, return 404
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ message: "API endpoint not found" });
        }
        res.sendFile(path.resolve(frontendPath, "index.html"));
    });
} else {
    // Root route if frontend is not built/found
    console.warn("⚠️ Frontend dist folder not found at:", frontendPath);
    app.get("/", (req, res) => {
        res.send("Task Management API is running... (Frontend build missing)");
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
