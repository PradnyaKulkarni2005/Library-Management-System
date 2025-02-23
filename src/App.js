
import './App.css';
import Home from './Components/Home'
import LoginPage from './Components/LoginPage';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<LoginPage />} />
      </Routes>
    
   
  );
}

export default App;
