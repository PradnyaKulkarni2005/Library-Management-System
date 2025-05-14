import React, { useState } from 'react';
import AvailableBooks from './AvailableBooks';
import AddBook from './AddBook';
import Editbook from './Editbook';
import IssuedBooks from './IssueBook';
import ReturnBook from './ReturnBook';
import MostIssuedBooks from './MostIssuedBooks';
import AddStudent from './Student/AddStudent';
import UpdateStudent from './Student/UpdateStudent';
import OverdueBooks from './OverdueBooks';
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
            case 'addstd':
                return <AddStudent />;
            case 'updatestd':
                return <UpdateStudent />;
            case 'pending':
                return <OverdueBooks />;
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
                <button onClick={() => setActiveTab('issued')}>Issue Book</button>
                <button onClick={() => setActiveTab('return')}>Return Book</button>
                <button onClick={() => setActiveTab('addstd')}>Add Student</button>
                <button onClick={() => setActiveTab('updatestd')}>Update Student Details</button>
                
                <button onClick={() => setActiveTab('most')}>Most Issued Books</button>
                <button onClick={() => setActiveTab('pending')}>Books Pending Return</button>

            </aside>
            <main className="main-content">
                {renderSection()}
            </main>
        </div>
    );
};

export default DashboardLayout;
