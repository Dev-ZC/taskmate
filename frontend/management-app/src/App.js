import './App.css';
import { useState, useEffect } from 'react';
//Maybe include Link, may break it?
import { Route, Routes, useLocation } from "react-router-dom"
import Nav from './components/navbar/nav.js'
import Landing from './components/landing/landing.js';
import Pricing from './components/pricing/pricing.js';
import ProjectNav from './projectmanager/projectNav.js';
import Project from './projectmanager/project.js';


function App() {
  const [page, setPage] = useState(<Landing />)

  const [currNav, setCurrNav] = useState(<Nav />)
  const location = useLocation();
  /*const { hash, pathname, search } = location;*/
  const managementRoute = "/login";

  useEffect(() => {
    if (location.pathname.includes(managementRoute)) {
      setCurrNav(<ProjectNav />);
    } else {
      setCurrNav(<Nav />);
    }
  }, [location.pathname, managementRoute]);

  return (
    <div className="App">
      {currNav }
      <div className='container'>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Project />} />
        </Routes>
      </div>
    </div>

  );
}

export default App;
