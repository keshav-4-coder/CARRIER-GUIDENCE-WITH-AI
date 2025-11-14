import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Lock, 
  Save, 
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import "../styles/Profile.css";

const API_BASE_URL = "http://localhost:8000/api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchProfile = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setProfileData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          bio: data.bio || "",
        });
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/profile/update/`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setMessage({ type: "error", text: "Failed to update profile" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Network error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    if (passwordData.new_password !== passwordData.new_password2) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/change-password/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({
          old_password: "",
          new_password: "",
          new_password2: "",
        });
      } else {
        setMessage({ 
          type: "error", 
          text: data.error || "Failed to change password" 
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({ type: "error", text: "Network error occurred" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1>My Profile</h1>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-card">
            <div className="user-avatar">
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt={user.full_name} />
              ) : (
                <span>{user?.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h3>{user?.full_name || user?.username}</h3>
            <p>{user?.email}</p>
            <span className={`badge ${user?.auth_provider}`}>
              {user?.auth_provider === "google" ? "🔐 Google Account" : "📧 Email Account"}
            </span>
          </div>

          <div className="profile-tabs">
            <button
              className={`tab ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={20} />
              Profile Information
            </button>
            {user?.auth_provider !== "google" && (
              <button
                className={`tab ${activeTab === "password" ? "active" : ""}`}
                onClick={() => setActiveTab("password")}
              >
                <Lock size={20} />
                Change Password
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <h2>Profile Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <User size={18} />
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.first_name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, first_name: e.target.value })
                    }
                    placeholder="Enter first name"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <User size={18} />
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.last_name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, last_name: e.target.value })
                    }
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="disabled"
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label>
                  <Phone size={18} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  placeholder="+1234567890"
                />
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={18} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={profileData.date_of_birth}
                  onChange={(e) =>
                    setProfileData({ ...profileData, date_of_birth: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  <User size={18} />
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <button type="submit" className="btn-save" disabled={saving}>
                <Save size={20} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {activeTab === "password" && user?.auth_provider !== "google" && (
            <form onSubmit={handlePasswordChange} className="profile-form">
              <h2>Change Password</h2>

              <div className="form-group">
                <label>
                  <Lock size={18} />
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, old_password: e.target.value })
                  }
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Lock size={18} />
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, new_password: e.target.value })
                  }
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Lock size={18} />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.new_password2}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, new_password2: e.target.value })
                  }
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button type="submit" className="btn-save" disabled={saving}>
                <Lock size={20} />
                {saving ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}