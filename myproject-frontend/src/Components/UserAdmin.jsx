import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
} from "lucide-react";
import "../styles/UserAdmin.css";

const API_BASE_URL = "http://localhost:8000/api";

export default function UserAdmin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/accounts/admin/users/`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.is_staff) {
      navigate("/login");
      return;
    }

    fetchUsers();
  }, [navigate, fetchUsers]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/accounts/admin/users/${id}/delete/`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );

        if (response.ok) {
          alert("✅ User deleted successfully!");
          fetchUsers();
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      is_active: user.is_active,
      is_staff: user.is_staff,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/accounts/admin/users/${editingUser.id}/update/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(editData),
        }
      );

      if (response.ok) {
        alert("✅ User updated successfully!");
        setShowEditModal(false);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/accounts/admin/users/${userId}/toggle-status/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        alert("✅ User status updated!");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update user status");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.first_name + " " + user.last_name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "active") return matchesSearch && user.is_active;
    if (filterStatus === "inactive") return matchesSearch && !user.is_active;
    if (filterStatus === "staff") return matchesSearch && user.is_staff;
    if (filterStatus === "google") return matchesSearch && user.auth_provider === "google";
    
    return matchesSearch;
  });

  return (
    <div className="user-admin-page">
      <div className="admin-header">
        <h1>
          <Users size={40} /> User Management
        </h1>
        <p>Manage all registered users and their access</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={32} />
          </div>
          <div className="stat-info">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <UserCheck size={32} />
          </div>
          <div className="stat-info">
            <h3>{users.filter((u) => u.is_active).length}</h3>
            <p>Active Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inactive">
            <UserX size={32} />
          </div>
          <div className="stat-info">
            <h3>{users.filter((u) => !u.is_active).length}</h3>
            <p>Inactive Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon staff">
            <Shield size={32} />
          </div>
          <div className="stat-info">
            <h3>{users.filter((u) => u.is_staff).length}</h3>
            <p>Admin Users</p>
          </div>
        </div>
      </div>

      <div className="admin-controls">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={20} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="staff">Admin Only</option>
            <option value="google">Google Users</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-data">
          <Users size={48} />
          <p>No users found</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Auth Provider</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="user-row">
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={user.full_name} />
                        ) : (
                          <span>{user.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="user-name">{user.full_name || user.username}</div>
                        <div className="user-username">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <div className="phone-cell">
                      <Phone size={16} />
                      {user.phone || "N/A"}
                    </div>
                  </td>
                  <td>
                    <span className={`auth-badge ${user.auth_provider}`}>
                      {user.auth_provider === "google" ? (
                        <>
                          <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="google-icon"
                          />
                          Google
                        </>
                      ) : (
                        "Email"
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={16} />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <button
                      className={`status-badge ${
                        user.is_active ? "active" : "inactive"
                      }`}
                      onClick={() => handleToggleStatus(user.id)}
                      title="Click to toggle status"
                    >
                      {user.is_active ? (
                        <>
                          <CheckCircle size={16} />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <span className={`role-badge ${user.is_staff ? "admin" : "user"}`}>
                      {user.is_staff ? (
                        <>
                          <Shield size={16} />
                          Admin
                        </>
                      ) : (
                        "User"
                      )}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditUser(user)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={editData.first_name || ""}
                onChange={(e) =>
                  setEditData({ ...editData, first_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={editData.last_name || ""}
                onChange={(e) =>
                  setEditData({ ...editData, last_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editData.email || ""}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={editData.phone || ""}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={editData.is_active || false}
                  onChange={(e) =>
                    setEditData({ ...editData, is_active: e.target.checked })
                  }
                />
                <span>Active</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={editData.is_staff || false}
                  onChange={(e) =>
                    setEditData({ ...editData, is_staff: e.target.checked })
                  }
                />
                <span>Admin</span>
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn cancel-btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn save-btn" onClick={handleUpdateUser}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}