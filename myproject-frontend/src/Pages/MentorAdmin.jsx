import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, EyeOff, CheckCircle, Clock, Search, Filter, Plus } from "lucide-react";
import "../styles/MentorAdmin.css";

const API_BASE_URL = "http://localhost:8000/api";

export default function MentorAdmin() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("mentors");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingMentor, setEditingMentor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    fetchMentors();
    fetchBookings();
  }, [navigate]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/mentors/`);
      const data = await response.json();
      setMentors(data.results || data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      alert("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/`);
      const data = await response.json();
      setBookings(data.results || data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleDeleteMentor = async (id) => {
    if (window.confirm("Are you sure you want to delete this mentor?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/mentors/${id}/`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert("✅ Mentor deleted successfully!");
          fetchMentors();
        }
      } catch (error) {
        console.error("Error deleting mentor:", error);
        alert("Failed to delete mentor");
      }
    }
  };

  const handleEditMentor = (mentor) => {
    setEditingMentor(mentor);
    setEditData(mentor);
    setShowEditModal(true);
  };

  const handleUpdateMentor = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/mentors/${editingMentor.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        alert("✅ Mentor updated successfully!");
        setShowEditModal(false);
        fetchMentors();
      }
    } catch (error) {
      console.error("Error updating mentor:", error);
      alert("Failed to update mentor");
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/complete/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        alert("✅ Booking marked as completed! Email sent.");
        fetchBookings();
      }
    } catch (error) {
      console.error("Error completing booking:", error);
      alert("Failed to complete booking");
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        alert("✅ Booking confirmed! Email sent.");
        fetchBookings();
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          alert("✅ Booking cancelled!");
          fetchBookings();
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking");
      }
    }
  };

  const filteredMentors = mentors.filter((mentor) =>
    mentor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffa500";
      case "confirmed":
        return "#0077b6";
      case "completed":
        return "#00b4d8";
      case "cancelled":
        return "#ff6b6b";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={18} />;
      case "confirmed":
        return <CheckCircle size={18} />;
      case "completed":
        return <Eye size={18} />;
      case "cancelled":
        return <EyeOff size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="mentor-admin-page">
      <div className="admin-header">
        <h1>📊 Mentor Admin Dashboard</h1>
        <p>Manage mentors, bookings, and sessions</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${selectedTab === "mentors" ? "active" : ""}`}
          onClick={() => setSelectedTab("mentors")}
        >
          👨‍🏫 Mentors ({mentors.length})
        </button>
        <button
          className={`tab-btn ${selectedTab === "bookings" ? "active" : ""}`}
          onClick={() => setSelectedTab("bookings")}
        >
          📅 Bookings ({bookings.length})
        </button>
      </div>

      {/* Mentors Tab */}
      {selectedTab === "mentors" && (
        <div className="tab-content">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search mentors by name or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading">Loading mentors...</div>
          ) : filteredMentors.length === 0 ? (
            <div className="no-data">
              <Search size={48} />
              <p>No mentors found</p>
            </div>
          ) : (
            <div className="mentors-table-container">
              <table className="mentors-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Expertise</th>
                    <th>Category</th>
                    <th>Rating</th>
                    <th>Sessions</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMentors.map((mentor) => (
                    <tr key={mentor.id} className="mentor-row">
                      <td className="mentor-name">{mentor.full_name}</td>
                      <td>{mentor.expertise}</td>
                      <td>{mentor.category}</td>
                      <td>
                        <span className="rating">⭐ {mentor.rating}</span>
                      </td>
                      <td>{mentor.total_sessions}</td>
                      <td>{mentor.experience}</td>
                      <td>
                        <span className={`status ${mentor.is_approved ? "approved" : "pending"}`}>
                          {mentor.is_approved ? "✅ Approved" : "⏳ Pending"}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditMentor(mentor)}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteMentor(mentor.id)}
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
        </div>
      )}

      {/* Bookings Tab */}
      {selectedTab === "bookings" && (
        <div className="tab-content">
          <div className="bookings-header">
            <div className="filter-group">
              <Filter size={20} />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="no-data">
              <Clock size={48} />
              <p>No bookings found</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-info">
                      <h3>{booking.student_name}</h3>
                      <p className="mentor-info">with <strong>{booking.mentor_name}</strong></p>
                    </div>
                    <span
                      className="booking-status"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="label">📧 Email:</span>
                      <span className="value">{booking.student_email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">📅 Date:</span>
                      <span className="value">{booking.booking_date}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">⏰ Time:</span>
                      <span className="value">{booking.booking_time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">📚 Topic:</span>
                      <span className="value">{booking.topic}</span>
                    </div>
                    {booking.notes && (
                      <div className="detail-row">
                        <span className="label">📝 Notes:</span>
                        <span className="value">{booking.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    {booking.status === "pending" && (
                      <button
                        className="action-btn confirm"
                        onClick={() => handleConfirmBooking(booking.id)}
                      >
                        ✓ Confirm
                      </button>
                    )}
                    {booking.status === "confirmed" && (
                      <button
                        className="action-btn complete"
                        onClick={() => handleCompleteBooking(booking.id)}
                      >
                        ✓ Complete
                      </button>
                    )}
                    {booking.status !== "completed" && booking.status !== "cancelled" && (
                      <button
                        className="action-btn cancel"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        ✗ Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingMentor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Mentor</h2>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={editData.full_name || ""}
                onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Expertise</label>
              <input
                type="text"
                value={editData.expertise || ""}
                onChange={(e) => setEditData({ ...editData, expertise: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={editData.rating || ""}
                onChange={(e) => setEditData({ ...editData, rating: parseFloat(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label>Approved</label>
              <input
                type="checkbox"
                checked={editData.is_approved || false}
                onChange={(e) => setEditData({ ...editData, is_approved: e.target.checked })}
              />
            </div>

            <div className="modal-actions">
              <button className="btn cancel-btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn save-btn" onClick={handleUpdateMentor}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}