import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Lazy-loaded pages
const LandingPage = lazy(() => import("./Pages/LandingPage"));
const Mentors = lazy(() => import("./Pages/Mentors"));
const About = lazy(() => import("./Pages/About"));
const AdminLogin = lazy(() => import("./Pages/AdminLogin"));
const MentorAdmin = lazy(() => import("./Pages/MentorAdmin"));
const Assessment = lazy(() => import("./Pages/Assessment"));

// Auth pages
const Login = lazy(() => import("./Components/Login"));
const Register = lazy(() => import("./Components/Register"));
const UserAdmin = lazy(() => import("./Components/UserAdmin"));
const Profile = lazy(() => import("./Components/Profile"));
const UserDashboard = lazy(() => import("./Components/UserDashboard"));

// Shared components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import "./styles/index.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

const Loader = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-black/80 z-50 text-cyan-400 text-xl font-bold">
    Loading...
  </div>
);

// Public route
function PublicRoute({ element }) {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.is_staff ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />;
  }
  return element;
}

// Protected route
function ProtectedRoute({ element, requireAdmin = false }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('accessToken');
  if (!token || !user) return <Navigate to="/login" replace />;
  if (requireAdmin && !user.is_staff) return <Navigate to="/dashboard" replace />;
  return element;
}

// Legacy mentor admin route
function ProtectedAdminRoute({ element }) {
  const isAdminAuthenticated = localStorage.getItem("adminToken");
  return isAdminAuthenticated ? element : <Navigate to="/admin/login" replace />;
}

// Layout component
function Layout() {
  const location = useLocation();

  const hideFooterRoutes = [
    "/assessment", "/mentor/admin", "/admin/login",
    "/login", "/register", "/admin/users",
    "/admin/dashboard", "/dashboard", "/profile"
  ];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  const hideNavbarRoutes = [
    "/mentor/admin", "/admin/login", "/login", "/register",
    "/admin/users", "/admin/dashboard", "/profile", "/dashboard"
  ];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="font-sans min-h-screen flex flex-col bg-black text-white">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow relative">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/about" element={<About />} />

            {/* Auth */}
            <Route path="/login" element={<PublicRoute element={<Login />} />} />
            <Route path="/register" element={<PublicRoute element={<Register />} />} />

            {/* User Protected */}
            <Route path="/dashboard" element={<ProtectedRoute element={<UserDashboard />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/assessment" element={<ProtectedRoute element={<Assessment userProfile={{name:"Alice", interests:"Web Development", course:"Computer Science"}} />} />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin={true} element={<UserAdmin />} />} />
            <Route path="/mentor/admin" element={<ProtectedAdminRoute element={<MentorAdmin />} />} />

            {/* 404 */}
            <Route path="*" element={<div className="p-8 text-center text-red-400">404 - Page Not Found</div>} />
          </Routes>
        </Suspense>
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Layout />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
