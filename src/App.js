
import './App.css';
import Home from './Components/Home'
import UserLogin from './Components/UserLogin';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<UserLogin />} />
      </Routes>
    
   
  );
}

export default App;
