import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getBookStatusCounts } from '../../api';
import './Analysis.css'; // Import the CSS

const COLORS = ['#0088FE', '#FF8042'];

export default function Analysis() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            console.log("Fetching book status counts...");
            const counts = await getBookStatusCounts();
            console.log("Book status counts:", counts);
            const chartData = [
                { name: 'Available', value: counts.Available },
                { name: 'Issued', value: counts.Issued }
            ];
            setData(chartData);
        }
        fetchData();
    }, []);

    return (
        <div className="analysis-container">
            <h3 className="analysis-heading">📚 Book Status Overview</h3>
            <div className="chart-wrapper">
                <PieChart width={400} height={300}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        </div>
    );
}
