import React, { useEffect, useState } from "react";
import "./BooksPerCategory.css"; // optional styles
import { getBooksPerCategory } from "../../api";

const BooksPerCat = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBooksPerCategory();
        setCategories(response.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load book categories.");
      }
    };
    fetchData();
  }, []);

  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="category-list-box">
      <h2 className="category-title">📊 Books per Category</h2>
      {categories.length > 0 ? (
        <ul className="category-list">
  {categories.map((cat, index) => (
    <li key={index} className="category-item">
      <strong>{cat.Category}</strong>
      <span>{cat.bookCount} books</span>
    </li>
  ))}
</ul>

      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BooksPerCat;
