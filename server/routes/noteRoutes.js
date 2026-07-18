import express from "express";
import {
  deleteNote,
  getNotesByChapter,
  uploadNote,
  viewNote,
} from "../controllers/noteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/chapter/:chapterId",
  authMiddleware,
  upload.single("file"),
  uploadNote,
);
router.get("/:id/view", authMiddleware, viewNote);
router.get("/chapter/:chapterId", authMiddleware, getNotesByChapter);

router.delete("/:id", authMiddleware, deleteNote);

export default router;
