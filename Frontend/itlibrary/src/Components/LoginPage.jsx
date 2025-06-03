import React, { useState } from "react";
import { login } from "../api";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const response = await login(formData);
      console.log("Login response:", response); // ✅ Debug

      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/dashboard"); // ✅ Correct route
      } else {
        alert("Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error); // ✅ Helpful for debugging
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="logincontainer">
        <div className="login-box">
          <div className="image-container">
            <img
              src="https://img.freepik.com/free-photo/abundant-collection-antique-books-wooden-shelves-generated-by-ai_188544-29660.jpg"
              alt="Kids Learning"
              className="login-image"
            />
          </div>

          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username:"
                className="input-field"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
              />
              <input
                type="password"
                placeholder="Password:"
                className="input-field"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              <button className="login-button" type="submit">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
