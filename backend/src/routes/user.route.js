import express from "express";
import { signup } from "../controllers/user.controller.js";
import { diet } from "../controllers/diet.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/diet", diet);

export default router;