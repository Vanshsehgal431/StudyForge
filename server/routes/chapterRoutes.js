import express from "express";
import {
  createChapter,
  deleteChapter,
  getChapterById,
  getChapters,
} from "../controllers/chapterController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/subject/:subjectId", authMiddleware, getChapters);

router.get("/:chapterId", authMiddleware, getChapterById);

router.post("/subject/:subjectId", authMiddleware, createChapter);

router.delete("/:chapterId", authMiddleware, deleteChapter);

export default router;
