import React, { useState } from "react";
import "./homestyles.css";

// Importing Components
import Hometab from "./Navtabs/Hometab"
import DepartmentTab from "./Navtabs/DepartmentTab"
import LibraryTab from "./Navtabs/LibraryTab";
import RulesTab from "./Navtabs/RulesTab";
import ContactTab from "./Navtabs/ContactTab";
import FeedbackTab from "./Navtabs/FeedbackTab";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Home");
  console.log("Home component is rendering!"); // Debugging

  // Map activeTab to the corresponding component
  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <Hometab />;
      case "Department":
        return <DepartmentTab />;
      case "Library":
        return <LibraryTab />;
      case "Rules":
        return <RulesTab />;
      case "Contact":
        return <ContactTab />;
      case "Feedback":
        return <FeedbackTab />;
      default:
        return <Hometab />;
    }
  };

  return (
    <div className="container">
      <div className="top-bar"></div>

      {/* Logos */}
      <img className="logo logo1" src="https://i.imgur.com/orbMs0M.png" alt="Logo 1" />
      <img className="logo logo2" src="https://i.imgur.com/Z1aiMdi.png" alt="Logo 2" />
      <img className="logo logo3" src="https://i.imgur.com/JkcKqkz.png" alt="Logo 3" />

      {/* College Name */}
      <div className="college-name">PIMPRI CHINCHWAD COLLEGE OF ENGINEERING</div>
      <div className="education-trust">PIMPRI CHINCHWAD EDUCATION TRUST's</div>

      {/* Accreditation Info */}
      <div className="accreditation">
        <span className="bold">NBA </span>Accredited |
        <span className="bold"> NAAC </span>Accredited with <span className="bold">'A' </span>Grade |
        <span className="bold"> Autonomous </span>Institute |
        <span className="bold"> AICTE </span>Approved |
        <span className="bold"> ISO 21001:2018 </span>Certified |
        Permanently Affiliated to <span className="bold">SPPU</span>, Pune
      </div>

      {/* Navigation Bar */}
      <div className="navbar">
        {["Home", "Department", "Library", "Rules", "Contact", "Feedback"].map((tab) => (
          <div key={tab} className="nav-item" onClick={() => setActiveTab(tab)}>
            {tab}
          </div>
        ))}
      </div>

      {/* Dynamic Content Section */}
      {renderContent()}

      {/* Footer */}
      <footer className="footer"></footer>
    </div>
  );
};

export default Home;
