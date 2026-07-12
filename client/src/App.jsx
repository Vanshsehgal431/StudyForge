import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import ChapterDetails from "./pages/ChapterDetails";
import Chapters from "./pages/Chapters";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Subjects from "./pages/Subjects";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/:subjectId"
          element={
            <ProtectedRoute>
              <Chapters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:subjectId/:chapterId"
          element={
            <ProtectedRoute>
              <ChapterDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
