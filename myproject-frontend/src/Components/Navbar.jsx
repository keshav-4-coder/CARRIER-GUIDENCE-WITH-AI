import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Brain,
  Users,
  Info,
  User,
  Menu,
  X,
  ChevronDown,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import "../styles/Navbar.css";

const API_BASE_URL = "http://localhost:8000/api";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navRef = useRef();
  const profileRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      // Call logout API
      if (accessToken && refreshToken) {
        await fetch(`${API_BASE_URL}/accounts/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all auth data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // Clear legacy tokens
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");

      setIsLoggedIn(false);
      setUser(null);
      setProfileOpen(false);
      setMenuOpen(false);
      navigate("/");
    }
  }, [navigate]);

  // Check auth status
  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (accessToken && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsLoggedIn(true);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          // Clear invalid data
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, [location.pathname]); // Only depend on pathname to avoid infinite loops

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, profileOpen]);

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Toggle profile dropdown
  const toggleProfile = () => setProfileOpen((prev) => !prev);

  const navItems = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { to: "/assessment", label: "AI Assessment", icon: <Brain size={18} /> },
    { to: "/mentors", label: "Mentors", icon: <Users size={18} /> },
    { to: "/about", label: "About Us", icon: <Info size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  // Get display name
  const getDisplayName = () => {
    if (!user) return "User";
    return user.full_name || user.first_name || user.username || "User";
  };

  return (
    <nav ref={navRef} className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="/static/Logo.png" alt="Path-Finder Logo" className="logo" />
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <ul className="navbar-links">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={isActive(item.to) ? "active" : ""}
            >
              {item.icon} {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop Actions */}
      <div className="navbar-actions">
        {isLoggedIn && user ? (
          <div ref={profileRef} className="profile-dropdown">
            <button onClick={toggleProfile} className="btn-profile">
              <div className="profile-avatar">
                {user.profile_picture ? (
                  <img src={user.profile_picture} alt={getDisplayName()} />
                ) : (
                  <span>{getDisplayName().charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="profile-name">{getDisplayName()}</span>
              <ChevronDown 
                size={16} 
                className={`chevron ${profileOpen ? "open" : ""}`} 
              />
            </button>
            
            {profileOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="user-info">
                    <p className="user-name">{getDisplayName()}</p>
                    <p className="user-email">{user.email}</p>
                    {user.is_staff && (
                      <span className="admin-badge">
                        <Shield size={12} /> Admin
                      </span>
                    )}
                  </div>
                </div>
                <hr />
                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <User size={16} /> My Profile
                </Link>
                <Link 
                  to="/dashboard" 
                  className="dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <Brain size={16} /> Dashboard
                </Link>
                {user.is_staff && (
                  <>
                    <hr />
                    <Link 
                      to="/admin/dashboard" 
                      className="dropdown-item admin"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Shield size={16} /> Admin Panel
                    </Link>
                  </>
                )}
                <hr />
                <button 
                  onClick={handleLogout} 
                  className="dropdown-item logout"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Show Login/Register buttons when NOT logged in */
          <>
            <Link to="/login" className="btn btn-secondary">
              <LogIn size={16} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              <UserPlus size={16} /> Register
            </Link>
          </>
        )}
      </div>

      {/* Hamburger Menu (Mobile) */}
      <button 
        className="hamburger" 
        onClick={toggleMenu} 
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-nav-links">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={isActive(item.to) ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>

          {isLoggedIn && user ? (
            <div className="mobile-actions">
              <div className="mobile-profile">
                <div className="mobile-user-info">
                  <div className="mobile-avatar">
                    {user.profile_picture ? (
                      <img src={user.profile_picture} alt={getDisplayName()} />
                    ) : (
                      <span>{getDisplayName().charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="mobile-user-details">
                    <p className="mobile-user-name">{getDisplayName()}</p>
                    <p className="mobile-user-email">{user.email}</p>
                    {user.is_staff && (
                      <span className="mobile-admin-badge">
                        <Shield size={12} /> Admin
                      </span>
                    )}
                  </div>
                </div>
                <hr />
                <Link 
                  to="/profile" 
                  className="mobile-link" 
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={16} /> My Profile
                </Link>
                <Link 
                  to="/dashboard" 
                  className="mobile-link" 
                  onClick={() => setMenuOpen(false)}
                >
                  <Brain size={16} /> Dashboard
                </Link>
                {user.is_staff && (
                  <Link 
                    to="/admin/dashboard" 
                    className="mobile-link admin" 
                    onClick={() => setMenuOpen(false)}
                  >
                    <Shield size={16} /> Admin Panel
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="btn btn-danger mobile-btn"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            /* Mobile Login/Register buttons */
            <div className="mobile-actions">
              <Link 
                to="/login" 
                className="btn btn-secondary mobile-btn"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={16} /> Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary mobile-btn"
                onClick={() => setMenuOpen(false)}
              >
                <UserPlus size={16} /> Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;