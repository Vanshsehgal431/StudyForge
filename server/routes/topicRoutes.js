import express from "express";
import { getTopicsByChapter } from "../controllers/topicController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/chapter/:chapterId", authMiddleware, getTopicsByChapter);

export default router;
