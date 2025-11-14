import React, { useEffect, useState } from "react";
import {
  Users,
  Brain,
  Target,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  Compass,
  Lightbulb,
  Shield,
  Rocket,
  Heart,
} from "lucide-react";
import "../styles/About.css";

const About = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const stats = [
    { value: "10,000+", label: "Students Guided", icon: Users },
    { value: "500+", label: "Expert Mentors", icon: Award },
    { value: "97%", label: "Success Rate", icon: TrendingUp },
    { value: "24/7", label: "Support Available", icon: Shield },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assessment",
      text: "Advanced AI technology analyzes your strengths, interests, and learning style to provide personalized career recommendations tailored specifically for you.",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      icon: Compass,
      title: "Expert Mentorship",
      text: "Connect with verified industry professionals who provide one-on-one guidance, share real-world insights, and help you navigate your career journey.",
      gradient: "from-cyan-400 to-teal-400",
    },
    {
      icon: Lightbulb,
      title: "Personalized Learning",
      text: "Access curated resources, courses, and learning paths designed specifically for your goals, pace, and chosen field of study or career.",
      gradient: "from-teal-400 to-blue-400",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Student-Centric",
      description: "Your success and growth are at the heart of everything we do.",
    },
    {
      icon: Rocket,
      title: "Innovation First",
      description: "We leverage cutting-edge technology to transform education.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data and privacy are protected with industry-leading security.",
    },
  ];

  const team = [
    {
      name: "Aashish Shrestha",
      role: "NLP Expert & AI Specialist",
      img: "/static/A.png",
      description: "Leading AI development and natural language processing",
    },
    {
      name: "Keshav Thapa",
      role: "Full Stack Developer",
      img: "/static/K.png",
      description: "Building seamless user experiences and robust systems",
    },
    {
      name: "Bidhan K.C",
      role: "Backend Architect",
      img: "/static/B.png",
      description: "Ensuring scalable and secure backend infrastructure",
    },
  ];

  return (
    <div className="about-page">
      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* STATS SECTION */}
      <section className="about-section stats-section">
        <div className="stats-grid">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-icon-wrapper">
                    <Icon className="stat-icon" size={36} />
                  </div>
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="about-section features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Student Guide</h2>
          <p className="section-subtitle">
            Experience personalized education powered by cutting-edge technology and human expertise
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="feature-card"
              >
                <div className="feature-card-content">
                  <div className={`feature-icon-wrapper gradient-${i}`}>
                    <Icon className="feature-icon" size={32} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-text">{feature.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="about-section values-section">
        <div className="section-header">
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle">
            The principles that guide everything we do
          </p>
        </div>

        <div className="values-grid">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <div key={i} className="value-card">
                <div className="value-icon-wrapper">
                  <Icon className="value-icon" size={40} />
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MISSION */}
      <section className="about-section mission-section">
        <div className="mission-content">
          <div className="mission-text">
            <div className="mission-badge">
              <Target size={16} />
              <span>OUR MISSION</span>
            </div>
            <h2 className="mission-title">
              Building the Next Generation of Leaders
            </h2>
            <p className="mission-description">
              We are redefining how students plan their futures by using advanced technology 
              to personalize education. Our mission is to empower a generation of confident, 
              skilled, and career-ready learners who are prepared to make a meaningful impact 
              in their chosen fields.
            </p>
            <div className="mission-stats">
              <div className="mission-stat-card">
                <BookOpen size={24} className="mission-stat-icon" />
                <div className="mission-stat-value">100%</div>
                <div className="mission-stat-label">AI Accuracy</div>
              </div>
              <div className="mission-stat-card">
                <Shield size={24} className="mission-stat-icon" />
                <div className="mission-stat-value">24/7</div>
                <div className="mission-stat-label">Support</div>
              </div>
              <div className="mission-stat-card">
                <GraduationCap size={24} className="mission-stat-icon" />
                <div className="mission-stat-value">500+</div>
                <div className="mission-stat-label">Courses</div>
              </div>
            </div>
          </div>

          <div className="mission-visual">
            <div className="mission-icon-container">
              <Target size={180} className="mission-icon" />
              <div className="mission-icon-rings">
                <div className="mission-ring"></div>
                <div className="mission-ring"></div>
                <div className="mission-ring"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="about-section team-section">
        <div className="section-header">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">
            Passionate experts dedicated to your success and growth
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, i) => (
            <div key={i} className="team-card">
              <div className="team-card-content">
                <div className="team-member-image-wrapper">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="team-member-image"
                  />
                  <div className="team-member-badge">
                    <Award size={16} />
                  </div>
                </div>
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-description">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-bg" />
        
        <div className="cta-content">
          <Rocket className="cta-icon" size={64} />
          <h2 className="cta-title">Ready to Unlock Your Potential?</h2>
          <p className="cta-subtitle">
            Take your first AI-powered assessment and get matched with the perfect
            mentor to guide your career journey.
          </p>
          <a href="/assessment" className="btn btn-cta">
            <Sparkles className="btn-icon" size={20} />
            Get Started Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;