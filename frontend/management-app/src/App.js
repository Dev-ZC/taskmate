import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import api from './projectmanager/api/axiosInstance.js'

import Nav from './components/navbar/nav.js'
import Landing from './components/landing/landing.js';
import Pricing from './components/pricing/pricing.js';
import Login from './components/login/login.js';
import Signup from './components/signup/signup.js';
// Importing directly to project instead
/*import ProjectNav from './projectmanager/projectNav.js';*/
import Project from './projectmanager/project.js';


function App() {
  const [page, setPage] = useState(<Landing />);
  const [currNav, setCurrNav] = useState(<Nav />);
  const [loading, setLoading] = useState(true); // State to manage loading
  const location = useLocation();
  const navigate = useNavigate();
  const managementRoute = "/project";

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        console.log("Makes a call!!!!");
        const response = await axios.get('http://127.0.0.1:8000/api/verify_session', {
          withCredentials: true // This ensures cookies are sent with the request
        });  // Check user session

        if (response.data.isAuthenticated) {
          console.log("User is authenticated");
        } else {
          console.error("User is not authenticated");
          navigate('/login');
        }
      } catch (err) {
        console.error("Error checking or refreshing user session:", err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    // Check session only for /project or sub-routes
    if (location.pathname.startsWith(managementRoute)) {
      setCurrNav(); // Set custom nav for project routes if necessary
      checkUserSession(); // Verify user session
    } else {
      setCurrNav(<Nav />); // Default nav
      setLoading(false); // Skip session check for other routes
    }
  }, [location.pathname, managementRoute, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while verifying session
  }

  return (
    <div className="App">
      {currNav}
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/project" element={<Project />} />

          {/* Dynamic route handling for any unknown sub-routes under /project */}
          <Route path="/project/*" element={<Navigate to="/project" replace />} />
          {/* Fallback for any other non-existent routes */}
          <Route path="*" element={<Navigate to="/project" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
