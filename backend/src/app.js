import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: [process.env.CORS_ORIGIN || "http://localhost:5173"],
    credentials: true
}));
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend is running!' });
});
app.get('/api/auth/signin', (req, res) => {
    res.status(200).json({ message: 'Signin is running!' });
});
app.get('/api/auth/signup', (req, res) => {
    res.status(200).json({ message: 'Signup is running!' });
});

app.use("/api", router);
// app.use("/api/auth", authRouter);







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

