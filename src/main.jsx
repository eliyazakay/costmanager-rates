// main.jsx
// Entry point for the React application.
// Sets up the MUI theme provider and mounts the App component.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

// Define the global MUI theme — dark glassmorphism design
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#90caf9' },
        secondary: { main: '#ce93d8' },
        background: { default: 'transparent', paper: '#1a2540' },
        text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.7)' }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    minHeight: '100vh'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none', backgroundColor: '#1a2540' }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)'
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.07)',
                    borderRadius: 8,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.25)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.8)'
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    '&.Mui-focused': { color: 'rgba(255, 255, 255, 0.9)' }
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                icon: { color: 'rgba(255, 255, 255, 0.6)' }
            }
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                        background: 'rgba(255, 255, 255, 0.28)',
                        boxShadow: '0 6px 20px rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-1px)'
                    },
                    '&.Mui-disabled': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    },
                    transition: 'all 0.25s ease'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.87)'
                },
                head: {
                    color: 'rgba(255, 255, 255, 0.55)',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                }
            }
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' }
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: 'rgba(255, 255, 255, 0.15)' }
            }
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: { color: 'rgba(255, 255, 255, 0.8)' }
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    borderRadius: 8,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }
            }
        }
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
