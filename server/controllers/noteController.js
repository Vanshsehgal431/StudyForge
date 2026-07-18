import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import Chapter from "../models/Chapter.js";
import Note from "../models/Note.js";

export async function uploadNote(req, res) {
  try {
    const { chapterId } = req.params;
    const { title } = req.body;

    const chapter = await Chapter.findOne({
      _id: chapterId,
      user: req.user.id,
    });

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a file.",
      });
    }

    const note = await Note.create({
      title,
      chapter: chapterId,
      fileName: req.file.originalname,
      s3Key: req.file.key,
      fileType: req.file.mimetype.includes("pdf") ? "pdf" : "image",
      uploadedBy: req.user.id,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to upload note.",
    });
  }
}
export async function viewNote(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: note.s3Key,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 900, // 15 minutes
    });

    res.json({
      url: signedUrl,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to generate file URL.",
    });
  }
}
export async function getNotesByChapter(req, res) {
  try {
    const { chapterId } = req.params;

    const notes = await Note.find({
      chapter: chapterId,
      uploadedBy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(notes);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch notes.",
    });
  }
}

export async function deleteNote(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: note.s3Key,
      }),
    );

    await note.deleteOne();

    res.json({
      message: "Note deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to delete note.",
    });
  }
}
