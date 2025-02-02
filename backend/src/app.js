import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: [process.env.CORS_ORIGIN || "http://localhost:5173"],
    credentials: true
}));











app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server error";
    console.error("Error:", err); // Log error details to console
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

export { app };

