import React, { useState, useEffect, useCallback } from "react";
import { UserPlus, Search, Star, Calendar, Clock, Award, BookOpen, X } from "lucide-react";
import "../styles/Mentors.css";

const API_BASE_URL = "http://localhost:8000/api";

// Helper function to convert time format
const convertTimeToFormat = (timeString) => {
  // Convert "09:00 AM" to "09:00:00"
  if (!timeString) return '00:00:00';
  
  try {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    
    hours = parseInt(hours);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  } catch (error) {
    console.error(error);
    return '00:00:00';
  }
};

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [bookingStep, setBookingStep] = useState(1);
  const [stats, setStats] = useState({
    total_mentors: 0,
    total_sessions: 0,
    average_rating: 0
  });
  const [bookingData, setBookingData] = useState({
    student_name: "",
    student_email: "",
    date: "",
    time: "",
    topic: "",
    notes: "",
  });
  const [newMentor, setNewMentor] = useState({
    full_name: "",
    expertise: "",
    category: "Academic Guidance",
    short_bio: "",
    education: "",
    email: "",
    experience: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const categories = ["All", "Academic Guidance", "Career & Skills", "Technology & Coding"];

  // Fetch mentors from API
    const fetchMentors = useCallback(async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        params.append('sort_by', sortBy);
  
        const response = await fetch(`${API_BASE_URL}/mentors/?${params}`);
        const data = await response.json();
        setMentors(data.results || data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        alert("Failed to load mentors. Please check your backend connection.");
      } finally {
        setLoading(false);
      }
    }, [searchQuery, selectedCategory, sortBy]);
  
    const fetchStats = useCallback(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/mentors/stats/`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }, []);
  
    useEffect(() => {
      fetchMentors();
      fetchStats();
    }, [fetchMentors, fetchStats]);

  const groupedMentors = mentors.reduce((acc, mentor) => {
    if (!acc[mentor.category]) acc[mentor.category] = [];
    acc[mentor.category].push(mentor);
    return acc;
  }, {});

  const handleBooking = (mentor) => {
    setSelectedMentor(mentor);
    setBookingStep(1);
    setBookingData({ 
      student_name: "",
      student_email: "",
      date: "", 
      time: "", 
      topic: "", 
      notes: "" 
    });
  };

  const handleBookingSubmit = async () => {
    if (!bookingData.student_name || !bookingData.student_email || !bookingData.date || !bookingData.time || !bookingData.topic) {
      alert("⚠️ Please complete all required fields");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentor: selectedMentor.id,
          student_name: bookingData.student_name,
          student_email: bookingData.student_email,
          booking_date: bookingData.date,
          booking_time: convertTimeToFormat(bookingData.time),
          topic: bookingData.topic,
          notes: bookingData.notes,
          status: 'pending'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}\n\nYou will receive a confirmation email shortly.`);
        setSelectedMentor(null);
        setBookingStep(1);
        setBookingData({ 
          student_name: "",
          student_email: "",
          date: "", 
          time: "", 
          topic: "", 
          notes: "" 
        });
        fetchStats();
      } else {
        alert(`⚠️ ${data.error || 'Booking failed. Please try again.'}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("⚠️ Failed to create booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAddMentor = async () => {
    if (!newMentor.full_name || !newMentor.expertise || !newMentor.email) {
      alert("⚠️ Please fill in all required fields (Full Name, Expertise, Email)");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/mentors/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMentor),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}`);
        setShowForm(false);
        setNewMentor({ 
          full_name: "", 
          expertise: "", 
          category: "Academic Guidance",
          short_bio: "", 
          education: "", 
          email: "", 
          experience: "" 
        });
        fetchMentors();
      } else {
        alert(`⚠️ ${data.error || 'Registration failed. Please try again.'}`);
      }
    } catch (error) {
      console.error("Error registering mentor:", error);
      alert("⚠️ Failed to register. Please try again.");
    }
  };

  const getAvailableTimes = () => {
    return ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
  };

  return (
    <div className="mentors-page">
      {/* Header Section */}
      <div className="mentors-header">
        <div>
          <h1 className="mentors-title">🚀 Mentorship Hub</h1>
          <p className="mentors-subtitle">Connect with expert mentors to guide your journey</p>
        </div>
        <button onClick={() => setShowForm(true)} className="register-btn btn btn-primary">
          <UserPlus size={20} /> Register as Mentor
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="filter-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search mentors by name or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-btn btn ${selectedCategory === cat ? "btn-primary" : "btn-outline"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="sessions">Sort by Sessions</option>
          </select>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <Award size={24} className="stat-icon" />
          <div>
            <div className="stat-number">{stats.total_mentors}</div>
            <div className="stat-label">Expert Mentors</div>
          </div>
        </div>
        <div className="stat-card">
          <BookOpen size={24} className="stat-icon" />
          <div>
            <div className="stat-number">{stats.total_sessions}+</div>
            <div className="stat-label">Sessions Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <Star size={24} className="stat-icon" />
          <div>
            <div className="stat-number">{stats.average_rating}</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      {loading ? (
        <div className="loading">Loading mentors...</div>
      ) : Object.keys(groupedMentors).length > 0 ? (
        <div className="mentors-section">
          {Object.keys(groupedMentors).map((category) => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="mentors-grid">
                {groupedMentors[category].map((mentor) => (
                  <div key={mentor.id} className="mentor-card">
                    <div className="mentor-header">
                      <div className="mentor-avatar">
                        {mentor.full_name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="mentor-rating">
                        <Star size={16} fill="cyan" color="cyan" />
                        <span>{mentor.rating}</span>
                      </div>
                    </div>

                    <h3 className="mentor-name">{mentor.full_name}</h3>
                    <p className="mentor-expertise">{mentor.expertise}</p>
                    <p className="mentor-bio">{mentor.short_bio}</p>

                    <div className="mentor-meta">
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>{mentor.experience}</span>
                      </div>
                      <div className="meta-item">
                        <BookOpen size={14} />
                        <span>{mentor.total_sessions} sessions</span>
                      </div>
                    </div>

                    <button onClick={() => handleBooking(mentor)} className="book-btn btn btn-primary">
                      <Calendar size={16} /> Book Session
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <Search size={48} />
          <p>No mentors found matching your criteria</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setSelectedMentor(null)} className="close-btn">
              <X size={24} />
            </button>

            <h2 className="modal-title">Book Session with {selectedMentor.full_name}</h2>
            <p className="modal-subtitle">{selectedMentor.expertise}</p>

            <div className="progress-bar">
              <div className={`progress-step ${bookingStep >= 1 ? "active" : ""}`}>1</div>
              <div className={`progress-line ${bookingStep >= 2 ? "active" : ""}`}></div>
              <div className={`progress-step ${bookingStep >= 2 ? "active" : ""}`}>2</div>
              <div className={`progress-line ${bookingStep >= 3 ? "active" : ""}`}></div>
              <div className={`progress-step ${bookingStep >= 3 ? "active" : ""}`}>3</div>
            </div>

            {bookingStep === 1 && (
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  value={bookingData.student_name}
                  onChange={(e) => setBookingData({ ...bookingData, student_name: e.target.value })}
                  className="form-input"
                  placeholder="Enter your full name"
                />
                <label className="form-label">Your Email *</label>
                <input
                  type="email"
                  value={bookingData.student_email}
                  onChange={(e) => setBookingData({ ...bookingData, student_email: e.target.value })}
                  className="form-input"
                  placeholder="your.email@example.com"
                />
                <label className="form-label">Select Date *</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="form-input"
                  min={new Date().toISOString().split("T")[0]}
                />
                <button
                  onClick={() => bookingData.student_name && bookingData.student_email && bookingData.date && setBookingStep(2)}
                  className="next-btn btn btn-primary"
                  disabled={!bookingData.student_name || !bookingData.student_email || !bookingData.date}
                >
                  Next
                </button>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="form-group">
                <label className="form-label">Select Time Slot *</label>
                <div className="time-slots-grid">
                  {getAvailableTimes().map((time, i) => (
                    <button
                      key={i}
                      onClick={() => setBookingData({ ...bookingData, time })}
                      className={`time-slot-btn btn ${bookingData.time === time ? "btn-primary" : "btn-outline"}`}
                    >
                      <Clock size={16} /> {time}
                    </button>
                  ))}
                </div>
                <div className="modal-btn-group">
                  <button onClick={() => setBookingStep(1)} className="back-btn btn btn-outline">
                    Back
                  </button>
                  <button
                    onClick={() => bookingData.time && setBookingStep(3)}
                    className="next-btn btn btn-primary"
                    disabled={!bookingData.time}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <div className="form-group">
                <label className="form-label">Session Topic *</label>
                <input
                  type="text"
                  value={bookingData.topic}
                  onChange={(e) => setBookingData({ ...bookingData, topic: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Career guidance for CS degree"
                />

                <label className="form-label">Additional Notes (Optional)</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  className="form-textarea"
                  placeholder="Any specific questions or topics you'd like to discuss..."
                />

                <div className="booking-summary">
                  <h4 className="summary-title">Booking Summary</h4>
                  <div className="summary-item">
                    <span>Mentor:</span>
                    <span>{selectedMentor.full_name}</span>
                  </div>
                  <div className="summary-item">
                    <span>Student:</span>
                    <span>{bookingData.student_name}</span>
                  </div>
                  <div className="summary-item">
                    <span>Date:</span>
                    <span>{bookingData.date}</span>
                  </div>
                  <div className="summary-item">
                    <span>Time:</span>
                    <span>{bookingData.time}</span>
                  </div>
                  <div className="summary-item">
                    <span>Topic:</span>
                    <span>{bookingData.topic || "Not specified"}</span>
                  </div>
                </div>

                <div className="modal-btn-group">
                  <button onClick={() => setBookingStep(2)} className="back-btn btn btn-outline">
                    Back
                  </button>
                  <button
                    onClick={handleBookingSubmit}
                    className="confirm-btn btn btn-primary"
                    disabled={!bookingData.topic || bookingLoading}
                  >
                    {bookingLoading ? "Processing..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Register Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content register-modal">
            <button onClick={() => setShowForm(false)} className="close-btn">
              <X size={24} />
            </button>

            <h2 className="modal-title">
              <UserPlus size={28} /> Register as Mentor
            </h2>
            <p className="modal-subtitle">Share your expertise and help students succeed</p>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                value={newMentor.full_name}
                onChange={(e) => setNewMentor({ ...newMentor, full_name: e.target.value })}
                className="form-input"
                placeholder="Enter your full name"
              />

              <label className="form-label">Email Address *</label>
              <input
                type="email"
                value={newMentor.email}
                onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                className="form-input"
                placeholder="your.email@example.com"
              />

              <label className="form-label">Category *</label>
              <select
                value={newMentor.category}
                onChange={(e) => setNewMentor({ ...newMentor, category: e.target.value })}
                className="form-input"
              >
                <option value="Academic Guidance">Academic Guidance</option>
                <option value="Career & Skills">Career & Skills</option>
                <option value="Technology & Coding">Technology & Coding</option>
              </select>

              <label className="form-label">Area of Expertise *</label>
              <input
                type="text"
                value={newMentor.expertise}
                onChange={(e) => setNewMentor({ ...newMentor, expertise: e.target.value })}
                className="form-input"
                placeholder="e.g., Web Development, Career Counseling"
              />

              <label className="form-label">Years of Experience</label>
              <input
                type="text"
                value={newMentor.experience}
                onChange={(e) => setNewMentor({ ...newMentor, experience: e.target.value })}
                className="form-input"
                placeholder="e.g., 5 years"
              />

              <label className="form-label">Education Background</label>
              <input
                type="text"
                value={newMentor.education}
                onChange={(e) => setNewMentor({ ...newMentor, education: e.target.value })}
                className="form-input"
                placeholder="Your highest qualification"
              />

              <label className="form-label">Short Bio</label>
              <textarea
                value={newMentor.short_bio}
                onChange={(e) => setNewMentor({ ...newMentor, short_bio: e.target.value })}
                className="form-textarea"
                placeholder="Tell us about yourself and what you can offer to students..."
              />

              <button onClick={handleAddMentor} className="submit-btn btn btn-primary">
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}