// NavBar.jsx
// Top navigation bar for the Cost Manager application.
// Renders the app title and tab-based navigation links.

import { AppBar, Toolbar, Tabs, Tab, Typography } from '@mui/material';

// Navigation tab definitions with display labels and route keys
const NAV_TABS = [
    { label: 'Add Cost', value: 'add' },
    { label: 'Monthly Report', value: 'report' },
    { label: 'Pie Chart', value: 'pie' },
    { label: 'Bar Chart', value: 'bar' },
    { label: 'Settings', value: 'settings' }
];

/*
 * NavBar renders the application's top AppBar with a tab set for navigation.
 * It receives the current page key and a callback to change the active page.
 */
function NavBar({ currentPage, onNavigate }) {
    // Handle tab change events and propagate the new page key upward
    const handleChange = (event, newValue) => {
        onNavigate(newValue);
    };

    return (
        <AppBar
            position='static'
            elevation={0}
            sx={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: 'none'
            }}
        >
            <Toolbar sx={{ gap: 1 }}>
                <Typography
                    sx={{
                        mr: 3,
                        fontFamily: '"Oxanium", "Inter", sans-serif',
                        fontWeight: 700,
                        fontSize: '1.75rem',
                        letterSpacing: '0.06em',
                        color: '#fff',
                        userSelect: 'none',
                        textTransform: 'uppercase',
                        textShadow: `
                            0 0 6px rgba(255, 255, 255, 1),
                            0 0 14px rgba(255, 255, 255, 0.85),
                            0 0 28px rgba(255, 255, 255, 0.65),
                            0 0 55px rgba(255, 255, 255, 0.35)
                        `
                    }}
                >
                    Spendly
                </Typography>

                {/* Navigation tabs aligned to the right of the title */}
                <Tabs
                    value={currentPage}
                    onChange={handleChange}
                    textColor='inherit'
                    TabIndicatorProps={{
                        style: { backgroundColor: '#90caf9', height: 3, borderRadius: '3px 3px 0 0' }
                    }}
                    variant='scrollable'
                    scrollButtons='auto'
                >
                    {NAV_TABS.map(tab => (
                        <Tab
                            key={tab.value}
                            label={tab.label}
                            value={tab.value}
                            sx={{
                                letterSpacing: '0.04em',
                                fontWeight: 500,
                                opacity: 0.72,
                                px: 2,
                                '&.Mui-selected': { opacity: 1, fontWeight: 600 }
                            }}
                        />
                    ))}
                </Tabs>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
