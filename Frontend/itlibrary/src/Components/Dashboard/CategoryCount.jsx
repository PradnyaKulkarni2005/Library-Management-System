import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryCount.css"; // Import the CSS file

const CategoryCount = () => {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/category-count")
      .then((response) => setCount(response.data.count))
      .catch(() => setError("Failed to load category count"));
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
