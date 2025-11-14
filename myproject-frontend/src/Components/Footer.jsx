import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3 className="footer-title">PathFinders</h3>
          <p className="footer-text">
            Empowering students and professionals to discover their ideal career
            paths with AI-powered guidance and personalized learning.
          </p>
        </div>

        <div>
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul>
            <li><Link to="/">About Us</Link></li>
            <li><Link to="/assessment">How it Works</Link></li>
            <li><Link to="/dashboard">Success Stories</Link></li>
            <li><Link to="/courses">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-subtitle">Services</h4>
          <ul>
            <li><Link to="/assessment">Career Assessment</Link></li>
            <li><Link to="/courses">Course Matching</Link></li>
            <li><Link to="/mentors">Mentor Booking</Link></li>
            <li><Link to="/dashboard">Resume Reviews</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-subtitle">Resources</h4>
          <ul>
            <li><Link to="/dashboard">Career Guides</Link></li>
            <li><Link to="/dashboard">Industry Insights</Link></li>
            <li><Link to="/dashboard">Salary Reports</Link></li>
            <li><Link to="/courses">Learning Paths</Link></li>
          </ul>
        </div>
      </div>

      <p className="footer-bottom">
        © {new Date().getFullYear()} <span>PathFinders</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
