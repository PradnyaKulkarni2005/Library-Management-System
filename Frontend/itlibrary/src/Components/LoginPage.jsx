import React, { useState } from "react";
import { login } from "../api";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent empty form submission
    if (!formData.username || !formData.password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const response = await login(formData);
      
      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/dashboard"); // Navigate only after successful login
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="container">
      <div className="logincontainer">
        <div className="login-box">
          {/* Left Side - Image */}
          <div className="image-container">
            <img
              src="https://img.freepik.com/free-photo/abundant-collection-antique-books-wooden-shelves-generated-by-ai_188544-29660.jpg"
              alt="Kids Learning"
              className="login-image"
            />
          </div>
          {/* Right Side - Login Form */}
          <div className="form-container">
            <input
              type="text"
              placeholder="Username:"
              className="input-field"
              value={formData.username} // Controlled input
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
            <input
              type="password"
              placeholder="Password:"
              className="input-field"
              value={formData.password} // Controlled input
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <button className="login-button" type="submit" onClick={handleSubmit}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
