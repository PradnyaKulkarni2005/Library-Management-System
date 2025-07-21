import React from "react";
import { FaBook, FaClock, FaUserGraduate, FaBan, FaIdCard } from "react-icons/fa";
import "./LibraryRules.css";

const RulesTab = () => {
  return (
    <section className="library-rules-section">
      <div className="rules-card fade-in">
        <h2 className="rules-title">📚 Library Rules</h2>
        <ul className="rules-list">
          <li>
            <FaIdCard className="icon" />
            Students must carry their Library ID card at all times when visiting the library.
          </li>
          <li>
            <FaBook className="icon" />
            Books should be returned within the stipulated time to avoid penalties.
          </li>
          <li>
            <FaClock className="icon" />
            Maintain silence in the library to ensure a focused reading environment.
          </li>
          <li>
            <FaUserGraduate className="icon" />
            Each student can borrow a maximum of 2 books at a time for a period of 15 days.
          </li>
          <li>
            <FaBan className="icon" />
            Damaging or marking books is strictly prohibited. Offenders will be fined.
          </li>
        </ul>
      </div>
    </section>
  );
};

export default RulesTab;
