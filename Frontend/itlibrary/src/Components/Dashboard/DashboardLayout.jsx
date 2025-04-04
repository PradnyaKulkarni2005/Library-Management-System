import React, { useState } from 'react';
import AvailableBooks from './AvailableBooks';
import AddBook from './AddBook';
import Editbook from './Editbook';
import IssuedBooks from './IssueBook';
import ReturnBook from './ReturnBook';
import MostIssuedBooks from './MostIssuedBooks';
import './Dashboard.css';

const DashboardLayout = () => {
    const [activeTab, setActiveTab] = useState('available');

    const renderSection = () => {
        switch (activeTab) {
            case 'available':
                return <AvailableBooks />;
            case 'add':
                return <AddBook />;
            case 'update':
                return <Editbook />;
            case 'issued':
                return <IssuedBooks />;
            case 'return':
                return <ReturnBook />;
            case 'most':
                return <MostIssuedBooks />;
            default:
                return <AvailableBooks />;
        }
    };

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar">
                <button onClick={() => setActiveTab('available')}>Available Books</button>
                <button onClick={() => setActiveTab('add')}>Add Book</button>
                <button onClick={() => setActiveTab('update')}>Update Book</button>
                <button onClick={() => setActiveTab('issued')}>Issued Books</button>
                <button onClick={() => setActiveTab('return')}>Books to Return</button>
                <button onClick={() => setActiveTab('most')}>Most Issued Books</button>
            </aside>
            <main className="main-content">
                {renderSection()}
            </main>
        </div>
    );
};

export default DashboardLayout;
