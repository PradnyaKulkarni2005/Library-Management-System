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

        <div className="card user-card" onClick={()=>{navigate ('/userlogin')}}>
          <img className="card-icon" src="https://i.imgur.com/B5Qk7xC.png" alt="User Icon" />
          <div className="card-title">USER</div>
        </div>
      </div>
      
    </div>
  )
}

