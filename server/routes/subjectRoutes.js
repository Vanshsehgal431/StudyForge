import express from "express";
import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
} from "../controllers/subjectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSubject);

router.get("/", authMiddleware, getSubjects);

router.delete("/:id", authMiddleware, deleteSubject);

router.get("/:subjectId", authMiddleware, getSubjectById);

export default router;
