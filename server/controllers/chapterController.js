import Chapter from "../models/Chapter.js";
import Resource from "../models/Resource.js";
import Topic from "../models/Topic.js";

async function createChapter(req, res) {
  try {
    const { name } = req.body;
    const { subjectId } = req.params;

    const chapter = await Chapter.create({
      name,
      subject: subjectId,
      user: req.user.id,
    });

    res.status(201).json(chapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
async function getChapters(req, res) {
  try {
    const chapters = await Chapter.find({
      subject: req.params.subjectId,
      user: req.user.id,
    }).sort({ createdAt: 1 });

    res.json(chapters);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getChapterById(req, res) {
  try {
    const chapter = await Chapter.findOne({
      _id: req.params.chapterId,
      user: req.user.id,
    });
    if (!chapter) {
      res.status(404).json({ message: "Chapter not found" });
    }

    res.json(chapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteChapter(req, res) {
  try {
    const chapter = await Chapter.findOne({
      _id: req.params.chapterId,
      user: req.user.id,
    });

    if (!chapter) {
      res.status(404).json({
        message: "Chapter not found",
      });
    }

    await chapter.deleteOne();
    await Topic.deleteMany({
      chapter: req.params.chapterId,
    });

    await Resource.deleteMany({
      chapter: req.params.chapterId,
    });
    res.json({
      message: "Chapter Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export { createChapter, deleteChapter, getChapterById, getChapters };
