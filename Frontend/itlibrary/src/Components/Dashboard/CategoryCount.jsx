import React, { useEffect, useState } from "react";
import "./CategoryCount.css";
import { getBookCategories } from "../../api";

const CategoryCount = () => {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchCount = async () => {
    try {
      const response = await getBookCategories(); // returns { count: 12 }
      console.log("Category count fetched successfully:", response.count);
      setCount(response.count); // ✅ FIXED
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch category count. Please try again later.");
    }
  };
  fetchCount();
}, []);


  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="category-box">
      <h2 className="category-title">📚 Categories in Library</h2>
      {count !== null ? (
  <p className="category-count">{count}</p>
) : (
  <p>Loading...</p>
)}

    </div>
  );
};

export default CategoryCount;
