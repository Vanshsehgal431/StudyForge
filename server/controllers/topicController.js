import Topic from "../models/Topic.js";

export async function getTopicsByChapter(req, res) {
  try {
    const { chapterId } = req.params;

    const topics = await Topic.find({
      chapter: chapterId,
      user: req.user.id,
    }).sort({ order: 1 });

    res.status(200).json(topics);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch topics.",
    });
  }
}
