import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css"; // import the CSS file

const LandingPage = () => {
  return (
    <div className="landing-root">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Find Your <span className="highlight">Perfect Career Path</span>
        </h1>
        <p className="hero-subtitle">
          AI-powered career assessment, mentor guidance, and personalized course
          recommendations – all in one platform.
        </p>
        <div className="hero-buttons">
          <Link to="/assessment" className="btn btn-primary">
            Start Your Journey
          </Link>
          <Link to="/mentors" className="btn btn-secondary">
            Find a Mentor
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="features">
          <div className="feature-card">
            <h3>Smart Course Matching</h3>
            <p>
              Get AI-powered suggestions for courses tailored to your strengths
              and goals.
            </p>
          </div>
          <div className="feature-card">
            <h3>Expert Mentorship</h3>
            <p>
              Book sessions with professionals who can guide you on your career
              journey.
            </p>
          </div>
          <div className="feature-card">
            <h3>Personalized Insights</h3>
            <p>
              Discover careers, skills, and industries that align with your
              unique interests.
            </p>
          </div>
        </div>
      </section>

      {/* Career Success Section */}
      <section className="section">
        <h2 className="section-title">
          Everything You Need for <span className="blue">Career Success</span>
        </h2>
        <p className="section-subtitle">
          From AI-powered assessments to real mentors and curated learning
          resources, we help you take the next step with confidence.
        </p>

        <div className="features">
          <div className="feature-card">
            <h3>AI Career Assessment</h3>
            <p>
              Analyze your skills, personality, and interests with AI to find
              your path.
            </p>
          </div>
          <div className="feature-card">
            <h3>Learning Roadmap</h3>
            <p>
              Discover the right courses and resources tailored to your career
              goals.
            </p>
          </div>
          <div className="feature-card">
            <h3>Mentor Support</h3>
            <p>
              Get guidance from industry experts to accelerate your success.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="cta-section">
        <h2 className="section-title">
          Ready to <span className="green">Discover Your Path?</span>
        </h2>
        <p className="section-subtitle">
          Take your free assessment today and unlock your personalized career
          journey.
        </p>
        <Link to="/assessment" className="btn btn-primary">
          Start Assessment
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
