import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  TrendingUp,
  Award,
  Clock,
  Home,
  MessageCircle,
  Brain,
  GraduationCap
} from "lucide-react";
import "../styles/Dashboard.css";

const API_BASE_URL = "http://localhost:8000/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(userData);
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const token = localStorage.getItem("accessToken");

      await fetch(`${API_BASE_URL}/accounts/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="user-welcome">
            <h1>Welcome back, {user?.first_name || user?.username}! 👋</h1>
            <p>Ready to continue your learning journey?</p>
          </div>
          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate("/")}
            >
              <Home size={20} />
              Home
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/profile")}
            >
              <Settings size={20} />
              Profile
            </button>
            <button className="btn-danger" onClick={handleLogout}>
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <BookOpen size={32} />
          </div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Courses Enrolled</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Calendar size={32} />
          </div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Sessions Booked</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={32} />
          </div>
          <div className="stat-info">
            <h3>0%</h3>
            <p>Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Award size={32} />
          </div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Achievements</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <button
              className="action-card"
              onClick={() => navigate("/mentors")}
            >
              <User size={40} />
              <h3>Find a Mentor</h3>
              <p>Connect with experienced mentors</p>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/assessment")}
            >
              <MessageCircle size={40} />
              <h3>Start Chat with AI</h3>
              <p>Get instant AI-powered guidance</p>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/assessment")}
            >
              <Brain size={40} />
              <h3>Start Learn with AI</h3>
              <p>Personalized AI learning experience</p>
            </button>

            <button className="action-card">
              <GraduationCap size={40} />
              <h3>Browse Courses</h3>
              <p>Explore our course library</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <Clock size={20} />
              <div>
                <p className="activity-title">No recent activity</p>
                <p className="activity-time">Start your learning journey today!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="dashboard-section">
          <h2>Upcoming Sessions</h2>
          <div className="sessions-list">
            <div className="empty-state">
              <Calendar size={48} />
              <p>No upcoming sessions</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/mentors")}
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}