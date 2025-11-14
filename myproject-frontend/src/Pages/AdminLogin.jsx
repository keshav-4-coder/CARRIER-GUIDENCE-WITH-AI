import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("⚠️ Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      // For development: Simple credential check
      // In production, replace with actual API authentication
      const ADMIN_EMAIL = "admin@pathfinders.com";
      const ADMIN_PASSWORD = "Admin@123";

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store auth token in localStorage
        localStorage.setItem("adminToken", "admin-auth-token-" + Date.now());
        localStorage.setItem("adminEmail", email);
        
        setSuccess("✅ Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/mentor/admin");
        }, 1500);
      } else {
        setError("❌ Invalid email or password");
      }
    } catch (err) {
      setError("❌ An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon">
            <Lock size={40} />
          </div>
          <h1>Admin Dashboard</h1>
          <p>Secure Access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="admin@pathfinders.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Success Message */}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Login Button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <code>Email: admin@pathfinders.com</code>
          <code>Password: Admin@123</code>
        </div>

        {/* Footer Text */}
        <div className="login-footer">
          <p>🔒 This area is protected and only accessible to administrators.</p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="background-animation"></div>
    </div>
  );
}