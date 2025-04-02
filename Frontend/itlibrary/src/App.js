
import './App.css';
import Home from './Components/Home'
import LoginPage from './Components/LoginPage';
import Register from './Components/Register';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import AddBook from './Components/AddBook';
import Editbook from './pages/Editbook';
function App() {
  return (
    
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path ="/dashboard" element={<Dashboard />} />
        <Route path ="/addbook" element={<AddBook />} />
        <Route path ="/updatebook" element={<Editbook />} />
      </Routes>
    
   
  );
}

export default App;
