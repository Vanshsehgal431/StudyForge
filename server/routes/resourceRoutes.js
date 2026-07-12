import express from "express";
import { getResourcesByChapter } from "../controllers/resourceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/chapter/:chapterId", authMiddleware, getResourcesByChapter);

export default router;
