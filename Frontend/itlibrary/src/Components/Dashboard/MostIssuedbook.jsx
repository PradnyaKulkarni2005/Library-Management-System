import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList,
} from 'recharts';
import { getMostIssuedBooks } from '../../api';
import './issued.css'; // Import CSS

const MostIssuedbook = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMostIssuedBooks = async () => {
    try {
      console.log("Fetching most issued books...");
      const result = await getMostIssuedBooks();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMostIssuedBooks();
  }, []);

  if (loading) return <p className="status-message">Loading most issued books...</p>;
  if (error) return <p className="status-message error-message">Error: {error}</p>;
  if (!data.length) return <p className="status-message">No most issued books data available.</p>;

  const sortedData = [...data].sort((a, b) => b.issue_count - a.issue_count).slice(0, 5);

  return (
    <div className="most-issued-container">
      <h3 className="most-issued-heading">📊 Top 5 Most Issued Books</h3>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={sortedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Title"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="issue_count" fill="#8884d8" name="Issue Count" barSize={40}>
              <LabelList dataKey="issue_count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MostIssuedbook;
