import React from 'react';
import './UserLogin.css';

export default function UserLogin() {
  return (
    <div className="login-container">
      <div className="image-section">
        <img className="left-image" src="https://via.placeholder.com/633x308" alt="Left" />
        <img className="right-image" src="https://via.placeholder.com/593x365" alt="Right" />
      </div>

      <div className="login-box">
        <img className="icon" src="https://via.placeholder.com/81x86" alt="User Icon" />
        <h2 className="login-title">USER LOGIN</h2>

        <label className="label">User Name:</label>
        <input className="input-field" type="text" />

        <label className="label">Password:</label>
        <input className="input-field" type="password" />

        <p className="forgot-password">Forgot Password?</p>
        <p className="register">Don’t have an account? Register</p>

        <button className="sign-in-btn">SIGN IN</button>
      </div>
    </div>
  );
}
