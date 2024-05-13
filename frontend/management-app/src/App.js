import './App.css';
import { useState } from 'react';
import { Route, Routes} from "react-router-dom"
import Nav from './components/navbar/nav.js'
import Landing from './components/landing/landing.js';
import Pricing from './components/pricing/pricing';


function App() {
  const [page, setPage] = useState(<Landing />)

  

  return (
    <div className="App">
      <Nav />
      <div className='container'>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </div>
    </div>

  );
}

export default App;
