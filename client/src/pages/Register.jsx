import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL =", API_URL);
function Register() {
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [remember, setRemember] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill all the fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!terms) {
      setError("Please accept Terms & Conditions");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        fullName,
        email,
        password,
      });

      console.log("User registered:", response.data);

      alert("Registration successful");
      navigate("/");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTerms(false);
      setError("");
    } catch (error) {
      console.error(
        "Registration failed.",
        error.response?.data || error.message,
      );
      alert(error.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">StudyForge</h1>

        <p className="subtitle">New to StudyForge</p>

        <form onSubmit={handleRegister}>
          {error && <p className="error">{error}</p>}
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your fullname"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
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
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="remember">
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <label htmlFor="terms">I agree to the Terms & Conditions</label>
          </div>

          <button type="submit">Create Account</button>
        </form>

        {/* <Link to="/forgot-password">Forgot Password?</Link> */}

        <hr />

        <p>Already have an account</p>

        <Link to="/">Login</Link>
      </div>
    </div>
  );
}

export default Register;
