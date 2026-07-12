import Chapter from "../models/Chapter.js";
import Resource from "../models/Resource.js";
import Subject from "../models/Subject.js";
import Topic from "../models/Topic.js";
import { generateRoadmap } from "../services/aiService.js";

export async function generateAIRoadmap(req, res) {
  try {
    const { chapterId } = req.params;

    const chapter = await Chapter.findOne({
      _id: chapterId,
      user: req.user.id,
    });

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found.",
      });
    }
    const subject = await Subject.findOne({
      _id: chapter.subject,
      user: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found.",
      });
    }
    const existingTopics = await Topic.exists({
      chapter: chapterId,
    });

    if (existingTopics) {
      return res.status(400).json({
        message: "Roadmap already generated.",
      });
    }
    const roadmap = await generateRoadmap(subject.name, chapter.name);

    await Topic.insertMany(
      roadmap.topics.map((topic, index) => ({
        title: topic.title,
        completed: false,
        order: index + 1,
        chapter: chapter._id,
        user: req.user.id,
      })),
    );
    await Resource.insertMany(
      roadmap.resources.map((resource) => ({
        title: resource.title,
        url: resource.url,
        chapter: chapter._id,
        user: req.user.id,
      })),
    );
    res.status(201).json({
      message: "Roadmap generated successfully",
      topics: roadmap.topics,
      resources: roadmap.resources,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to generate roadmap.",
    });
  }
}
