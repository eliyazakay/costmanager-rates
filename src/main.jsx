// main.jsx
// Entry point for the React application.
// Sets up the MUI theme provider and mounts the App component.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

// Define the global MUI theme for the entire application
const theme = createTheme({
    palette: {
        primary: { main: '#1565c0' },
        secondary: { main: '#e53935' }
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            {/* CssBaseline normalizes browser default styles across all browsers */}
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
