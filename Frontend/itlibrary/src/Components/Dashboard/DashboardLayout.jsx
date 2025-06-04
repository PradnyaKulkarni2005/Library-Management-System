import React, { useState } from 'react';
import AvailableBooks from './AvailableBooks';
import AddBook from './AddBook';
import Editbook from './Editbook';
import IssuedBooks from './IssueBook';
import ReturnBook from './ReturnBook';

import AddStudent from './Student/AddStudent';
import UpdateStudent from './Student/UpdateStudent';
import OverdueBooks from './OverdueBooks';
import Analysis from './Analysis';
import MostIssuedbook from './MostIssuedbook';  
import './Dashboard.css';
import AdminReport from './AdminReport';

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
            case 'analysis':
                return <Analysis />;
                
            case 'addstd':
                return <AddStudent />;
            case 'updatestd':
                return <UpdateStudent />;
            case 'report':
                return <AdminReport />;
            case 'pending':
                return <OverdueBooks />;
            case 'mostissued':
                return <MostIssuedbook />;
            
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
                <button onClick={() => setActiveTab('pending')}>Books Pending Return</button>
                <button onClick={() => setActiveTab('analysis')}>Analysis</button>
                <button onClick={() => setActiveTab('mostissued')}>Most Issued Books</button>
                <button onClick={() => setActiveTab('report')}>Admin Report</button>
                

            </aside>
            <main className="main-content">
                {renderSection()}
            </main>
        </div>
    );
};

export default DashboardLayout;
