import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  deleteNote,
  getMyNotes,
  uploadNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadNote);

router.get("/", authMiddleware, getMyNotes);

router.delete("/:id", authMiddleware, deleteNote);

export default router;
