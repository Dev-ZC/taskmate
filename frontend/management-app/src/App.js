import './App.css';
import { useState } from 'react';
import Nav from './components/navbar/nav.js'
import Landing from './components/landing/landing.js';


function App() {
  const [page, setPage] = useState(<Landing />)

  

  return (
    <div className="App">
      <Nav />
      {page}
    </div>

  );
}

export default App;
