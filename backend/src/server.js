import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
            console.log(`Server is running at ${process.env.PORT}`);
            
        });
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!", err);
        
    })