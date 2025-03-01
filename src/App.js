
import './App.css';
import Home from './Components/Home'
import LoginPage from './Components/LoginPage';
import Register from './Components/Register';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    
   
  );
}

export default App;
