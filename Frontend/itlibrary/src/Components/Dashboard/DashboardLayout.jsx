import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, faPlus, faEdit, faArrowCircleUp, faUndo, 
  faUserPlus, faUserEdit, faClock, faChartBar, faStar, faFileAlt 
} from '@fortawesome/free-solid-svg-icons';

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
import ExcelUpload from './Student/ExcelUpload'

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
            case 'upload':
                return <ExcelUpload/>   
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
  <div className="sidebar-title">Library Dashboard</div>
  <div className="menu">
    <div className={`menu-item ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>
      <FontAwesomeIcon icon={faBookOpen} /> Available Books
    </div>
    <div className={`menu-item ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
      <FontAwesomeIcon icon={faPlus} /> Add Book
    </div>
    <div className={`menu-item ${activeTab === 'update' ? 'active' : ''}`} onClick={() => setActiveTab('update')}>
      <FontAwesomeIcon icon={faEdit} /> Update Book
    </div>
    <div className={`menu-item ${activeTab === 'issued' ? 'active' : ''}`} onClick={() => setActiveTab('issued')}>
      <FontAwesomeIcon icon={faArrowCircleUp} /> Issue Book
    </div>
    <div className={`menu-item ${activeTab === 'return' ? 'active' : ''}`} onClick={() => setActiveTab('return')}>
      <FontAwesomeIcon icon={faUndo} /> Return Book
    </div>
    <div className={`menu-item ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>
      <FontAwesomeIcon icon={faUserPlus} /> Student & Book Excel Upload
    </div>
    <div className={`menu-item ${activeTab === 'addstd' ? 'active' : ''}`} onClick={() => setActiveTab('addstd')}>
      <FontAwesomeIcon icon={faUserPlus} /> Add Student
    </div>
    <div className={`menu-item ${activeTab === 'updatestd' ? 'active' : ''}`} onClick={() => setActiveTab('updatestd')}>
      <FontAwesomeIcon icon={faUserEdit} /> Update Student
    </div>
    <div className={`menu-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
      <FontAwesomeIcon icon={faClock} /> Pending Returns
    </div>
    <div className={`menu-item ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>
      <FontAwesomeIcon icon={faChartBar} /> Analysis
    </div>
    <div className={`menu-item ${activeTab === 'mostissued' ? 'active' : ''}`} onClick={() => setActiveTab('mostissued')}>
      <FontAwesomeIcon icon={faStar} /> Most Issued
    </div>
    <div className={`menu-item ${activeTab === 'report' ? 'active' : ''}`} onClick={() => setActiveTab('report')}>
      <FontAwesomeIcon icon={faFileAlt} /> Admin Report
    </div>
  </div>
</aside>

            <main className="main-content">
                {renderSection()}
            </main>
        </div>
    );
};

export default DashboardLayout;
