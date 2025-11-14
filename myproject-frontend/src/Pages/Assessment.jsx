import React, { useState, useRef, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Bot, User, Send, Loader } from "lucide-react";
import "../styles/Assessment.css";

export default function StudentChatbot() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  // Get user's full name or fallback to username
  const getUserName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user?.first_name) {
      return user.first_name;
    } else if (user?.username) {
      return user.username;
    }
    return "User";
  };

  const userName = getUserName();

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hello ${userName}! 👋 I'm your AI Career Mentor. I'm here to help you explore career paths, identify your strengths, and guide you toward your professional goals. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: userName,
    interest: user?.interests || "general",
  });
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Reset scroll to top on page load to prevent navbar jump
    window.scrollTo(0, 0);

    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, location.pathname]);

  useEffect(() => {
    const getUpdatedName = () => {
      if (user?.first_name && user?.last_name) {
        return `${user.first_name} ${user.last_name}`;
      } else if (user?.first_name) {
        return user.first_name;
      } else if (user?.username) {
        return user.username;
      }
      return "User";
    };
    
    const updatedName = getUpdatedName();
    setUserProfile({
      name: updatedName,
      interest: user?.interests || "general",
    });
    console.log("AuthContext user:", user);
  }, [user]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev, 
      { sender: "user", text: trimmedInput, timestamp }
    ]);
    setInput("");
    setIsTyping(true);

    // Show typing indicator
    setMessages((prev) => [
      ...prev, 
      { sender: "bot", text: "typing", isTyping: true, timestamp }
    ]);
    setIsLoading(true);

    try {
      // 🔧 FIXED: Added withCredentials to allow CSRF cookies
      const response = await axios.post(
        "http://127.0.0.1:8000/chat/api/chat/",
        { 
          message: trimmedInput, 
          userProfile,
          userId: user?.id || 'anonymous'
        },
        { 
          timeout: 30000,
          withCredentials: true,  // ✅ THIS IS THE KEY FIX FOR CSRF ERROR
          headers: { 
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        console.log("API userProfile response:", response.data.userProfile);
        if (response.data.userProfile) {
          setUserProfile(response.data.userProfile);
        }

        const botTimestamp = new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { 
            sender: "bot", 
            text: response.data.response, 
            timestamp: botTimestamp 
          },
        ]);
      } else {
        throw new Error(response.data.error || "Unknown error");
      }
    } catch (error) {
      console.error("API Error:", error);
      const errorMsg = error.response?.data?.error || error.message || "Unable to connect to the server. Please try again.";
      const errorTimestamp = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { 
          sender: "bot", 
          text: `I apologize, but I encountered an error: ${errorMsg}. Please try again or rephrase your question.`,
          timestamp: errorTimestamp,
          isError: true
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="chatbot-page">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-left">
            <div className="bot-avatar">
              <Bot size={24} />
            </div>
            <div className="header-info">
              <h2>AI Career Mentor</h2>
              <span className={`status ${isTyping ? 'typing' : 'online'}`}>
                {isTyping ? 'Typing...' : 'Online'}
              </span>
            </div>
          </div>
          <div className="user-info">
            <span className="user-name">{userProfile.name}</span>
            <div className="user-avatar">{getInitials(userProfile.name)}</div>
          </div>
        </div>

        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender}`}>
              {msg.sender === "bot" && (
                <div className="message-avatar bot-icon">
                  <Bot size={20} />
                </div>
              )}
              <div className={`chat-message ${msg.sender}-message ${msg.isError ? 'error' : ''}`}>
                {msg.isTyping ? (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <>
                    <div className="message-content">{msg.text}</div>
                    {msg.timestamp && (
                      <div className="message-timestamp">{msg.timestamp}</div>
                    )}
                  </>
                )}
              </div>
              {msg.sender === "user" && (
                <div className="message-avatar user-icon">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <div className="input-wrapper">
            <textarea
              className="chat-input"
              placeholder="Ask me about career paths, skills, or professional guidance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              rows="1"
            />
            <button
              className={`btn-send ${isLoading ? 'loading' : ''} ${!input.trim() ? 'disabled' : ''}`}
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader size={20} className="spinner" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
          <div className="input-hints">
            <span>💡 Try asking: "What career suits my skills?" or "How do I improve my resume?"</span>
          </div>
        </div>
      </div>
    </div>
  );
}