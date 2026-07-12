import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // console.log("Email:", email);
    // console.log("Password:", password);
    // console.log("Remember:", remember);
    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      console.log("Login successful:", response.data);

      alert("Login successful!");

      // Optional: Save the token if your backend returns one
      localStorage.setItem("token", response.data.token);
      // localStorage.setItem("token", response.data.token);

      // Optional: Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);

      setError(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">StudyForge</h1>

        <p className="subtitle">Continue your learning journey</p>

        <form onSubmit={handleLogin}>
          {error && <p className="error">{error}</p>}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="remember">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember">Remember Me</label>
          </div>

          <button type="submit">Login</button>
        </form>

        <Link to="/forgot-password">Forgot Password?</Link>

        <hr />

        <p>Don't have an account?</p>

        <Link to="/register">Create Account</Link>
      </div>
    </div>
  );
}

export default Login;
