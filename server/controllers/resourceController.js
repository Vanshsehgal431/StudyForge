import Resource from "../models/Resource.js";

export async function getResourcesByChapter(req, res) {
  try {
    const { chapterId } = req.params;

    const resources = await Resource.find({
      chapter: chapterId,
      user: req.user.id,
    });

    res.status(200).json(resources);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch resources.",
    });
  }
}
