import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  deleteNote,
  getNotesByChapter,
  uploadNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.post(
  "/chapter/:chapterId",
  authMiddleware,
  upload.single("file"),
  uploadNote,
);

router.get("/chapter/:chapterId", authMiddleware, getNotesByChapter);

router.delete("/:id", authMiddleware, deleteNote);

export default router;
