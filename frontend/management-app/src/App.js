import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
import axios from 'axios';
import { Navigate } from 'react-router-dom';

import Nav from './components/navbar/nav.js'
import Landing from './components/landing/landing.js';
import Pricing from './components/pricing/pricing.js';
import Login from './components/login/login.js';
import Signup from './components/signup/signup.js';
// Importing directly to project instead
/*import ProjectNav from './projectmanager/projectNav.js';*/
import Project from './projectmanager/project.js';


function App() {
  const [page, setPage] = useState(<Landing />)

  const [currNav, setCurrNav] = useState(<Nav />)
  const location = useLocation();
  /*const { hash, pathname, search } = location;*/
  const managementRoute = "/project";

  useEffect(() => {
    if (location.pathname.includes(managementRoute)) {
      /*setCurrNav(<ProjectNav />);*/
      setCurrNav();
    } else {
      setCurrNav(<Nav />);
    }
  }, [location.pathname, managementRoute]);

  return (
    <div className="App">
      { currNav }
      <div className='container'>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/project" element={<Project />} />

          {/* Dynamic route handling for any unknown sub-routes under /project */}
          <Route path="/project/*" element={<Navigate to="/project" replace />} />
          {/* Fallback for any other non-existent routes, coudl go to a NotFound page */}
          <Route path="*" element={/*<NotFound />*/ <Navigate to="/project" replace />} />
        </Routes>
      </div>
    </div>

  );
}

export default App;
