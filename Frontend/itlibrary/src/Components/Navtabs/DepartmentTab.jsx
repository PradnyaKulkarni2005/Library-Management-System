import React from "react";
import { FaLightbulb, FaLaptopCode, FaIndustry, FaRocket, FaUsers } from "react-icons/fa";
import "./VisionMission.css";

const DepartmentTab = () => {
  return (
    <section className="vision-mission-section">
      <div className="vision-card fade-in">
        <h2 className="section-title">🎯 Vision</h2>
        <p className="section-text">
          To become a front-runner in the western region in preparing Information Technology engineers
          with academic excellence and research skills empowering their roles in technology and society.
        </p>
      </div>

      <div className="mission-card fade-in">
        <h2 className="section-title">🚀 Mission</h2>
        <ul className="mission-list">
          <li>
            <FaLaptopCode className="icon" />
            Equip students with the skills and knowledge through a dynamic learning environment.
          </li>
          <li>
            <FaIndustry className="icon" />
            Collaborate with industries to nurture proficient Information Technology Engineers.
          </li>
          <li>
            <FaRocket className="icon" />
            Cultivate a spirit of research, innovation, and entrepreneurship to address community and business challenges.
          </li>
          <li>
            <FaUsers className="icon" />
            Imbibe work ethics and leadership skills through co-curricular and extracurricular activities.
          </li>
        </ul>
      </div>
    </section>
  );
};

export default DepartmentTab;
