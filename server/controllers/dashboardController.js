import Subject from "../models/Subject.js";

async function getDashboard(req, res) {
  try {
    const subjects = await Subject.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      activeSubjects: subjects.length,
      subjects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
}

export default getDashboard;
