import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "https://study-forge-gilt.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/resources", resourceRoutes);

app.get("/", (req, res) => {
  res.send("StudyForge API is running...");
});

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

startServer();
