import React from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Side Image */}
        <div className="left-image"></div>

        {/* Login Box */}
        <div className="login-form">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User Icon" className="user-icon" />
          <h2 className="login-title">USER LOGIN</h2>
          <div className="input-container">
            <label className="input-label">User Name:</label>
            <input type="text" className="input-field" placeholder="Enter your username" />
            <label className="input-label">Password:</label>
            <input type="password" className="input-field" placeholder="Enter your password" />
          </div>
          <button className="login-button">LOGIN</button>
          <div className="login-footer">
            <a href="#" className="forgot-password">Forgot Password?</a>
            <span>Don't have an account? 
              <Link to="/register" className="register-link"> Register</Link>
            </span>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="right-image"></div>
      </div>
    </div>
  );
};

export default LoginPage;
