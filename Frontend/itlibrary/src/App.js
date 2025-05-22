
import './App.css';
import Home from './Components/Home'
import LoginPage from './Components/LoginPage';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import AddBook from './Components/Dashboard/AddBook';
import IssuedBooks from './Components/Dashboard/IssueBook';


import AvailableBooks from './Components/Dashboard/AvailableBooks';
import Editbook from './Components/Dashboard/Editbook';
import DashboardLayout from './Components/Dashboard/DashboardLayout';
function App() {
  return (
    
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<LoginPage />} />
        
        <Route path ="/dashboard" element={<DashboardLayout />} />
        <Route path ="/addbook" element={<AddBook />} />
        <Route path ="/updatebook" element={<Editbook />} />
      </Routes>
    
   
  );
}

export default App;
