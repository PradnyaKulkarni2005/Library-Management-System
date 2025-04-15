import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
export default function Hometab() {
  const navigate=useNavigate();
  return (
    <div>
        <div className="admin-user-section">
        <div className="card admin-card">
          <img className="card-icon" src="https://i.imgur.com/nihp3VU.png" alt="Admin Icon" onClick={()=>{navigate ('/userlogin')}} />
          <div className="card-title">ADMIN</div>
        </div>

        <div>
          <img  src="https://media.istockphoto.com/id/944631208/photo/education-concept-with-book-in-library.jpg?s=612x612&w=0&k=20&c=uJF-uOU5MRR-iwXqJEPAdXeaH-VJ-nqt6TdKUpEdEkk=" className="right-image" alt="User Icon" />
          
        </div>
      </div>
      
    </div>
  )
}

