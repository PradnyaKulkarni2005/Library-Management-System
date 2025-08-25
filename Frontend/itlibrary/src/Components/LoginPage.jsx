import React, { useState } from "react";
import { login } from "../api";
import styles from "./LoginPage.module.css";
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
      console.log("Login response:", response);

      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        {/* Left Image Slide */}
        <div className={styles.imageSlide}>
          <img
            src="https://img.freepik.com/free-photo/abundant-collection-antique-books-wooden-shelves-generated-by-ai_188544-29660.jpg"
            alt="Library"
          />
          <div className={styles.overlay}>
            <h1>Welcome Back !</h1>
            <p>Access the admin dashboard to manage books & students</p>
          </div>
        </div>

        {/* Right Login Slide */}
        <div className={styles.formSlide}>
          <div className={styles.formBox}>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                className={styles.inputField}
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
              />
              <input
                type="password"
                placeholder="Password"
                className={styles.inputField}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              <button className={styles.loginButton} type="submit">
                Login →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
