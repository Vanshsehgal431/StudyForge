import Chapter from "../models/Chapter.js";
import Subject from "../models/Subject.js";
async function createSubject(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const existingSubject = await Subject.findOne({
      name: name.trim(),
      user: req.user.id,
    });

    if (existingSubject) {
      return res.status(400).json({
        message: "Subject already exists.",
      });
    }
    const subject = await Subject.create({
      name: name.trim(),
      user: req.user.id,
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create subject",
    });
  }
}

async function getSubjects(req, res) {
  try {
    const subjects = await Subject.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(subjects);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch subjects.",
    });
  }
}

async function deleteSubject(req, res) {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found.",
      });
    }
    await Chapter.deleteMany({
      subject: req.params.id,
    });
    res.json({
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete subject.",
    });
  }
}

async function getSubjectById(req, res) {
  try {
    const subject = await Subject.findOne({
      _id: req.params.subjectId,
      user: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json(subject);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
export { createSubject, deleteSubject, getSubjectById, getSubjects };
