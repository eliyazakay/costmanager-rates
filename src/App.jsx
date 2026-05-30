// App.jsx
// Root component of the Cost Manager application.
// Manages navigation state and renders the active page.

import { useState, useMemo } from 'react';
import { Box, Container } from '@mui/material';
import NavBar from './components/NavBar';
import AddCostForm from './components/AddCostForm';
import MonthlyReport from './components/MonthlyReport';
import PieChartView from './components/PieChartView';
import BarChartView from './components/BarChartView';
import Settings from './components/Settings';
import { openCostsDB } from './db';

// Constants for the database used throughout the application
const DB_NAME = 'costsdb';
const DB_VERSION = 1;

function App() {
    // Track which page is currently visible
    const [currentPage, setCurrentPage] = useState('add');

    // Open the database once and reuse the same instance across renders
    const dbInstance = useMemo(() => openCostsDB(DB_NAME, DB_VERSION), []);

    // Return the correct component based on the active navigation tab
    const renderPage = () => {
        switch (currentPage) {
            case 'add':
                return <AddCostForm dbInstance={dbInstance} />;
            case 'report':
                return <MonthlyReport dbName={DB_NAME} />;
            case 'pie':
                return <PieChartView dbName={DB_NAME} />;
            case 'bar':
                return <BarChartView dbName={DB_NAME} />;
            case 'settings':
                return <Settings />;
            default:
                return <AddCostForm dbInstance={dbInstance} />;
        }
    };

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
            {/* Navigation bar is always visible at the top */}
            <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
            <Container maxWidth='md' sx={{ mt: 4, pb: 4 }}>
                {renderPage()}
            </Container>
        </Box>
    );
}

export default App;
