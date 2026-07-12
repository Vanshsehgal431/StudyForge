import fs from "fs";
import path from "path";
import Note from "../models/Note.js";

async function uploadNote(req, res) {
  try {
    const { title, subject } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload the file",
      });
    }
    const note = await Note.create({
      title,
      subject,
      fileName: req.file.filename,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype.includes("pdf") ? "pdf" : "image",
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getMyNotes(req, res) {
  try {
    const notes = await Note.find({
      uploadedBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    if (note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    fs.unlinkSync(path.join("uploads", note.fileName));

    await note.deleteOne();

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export { deleteNote, getMyNotes, uploadNote };
