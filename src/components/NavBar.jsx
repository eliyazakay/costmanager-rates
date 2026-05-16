// NavBar.jsx
// Top navigation bar for the Cost Manager application.
// Renders the app title and tab-based navigation links.

import { AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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
        <AppBar position='static'>
            <Toolbar>
                {/* Application icon and title */}
                <AttachMoneyIcon sx={{ mr: 1 }} />
                <Typography variant='h6' sx={{ mr: 4, fontWeight: 700 }}>
                    Cost Manager
                </Typography>

                {/* Navigation tabs aligned to the right of the title */}
                <Tabs
                    value={currentPage}
                    onChange={handleChange}
                    textColor='inherit'
                    indicatorColor='secondary'
                    variant='scrollable'
                    scrollButtons='auto'
                >
                    {NAV_TABS.map(tab => (
                        <Tab key={tab.value} label={tab.label} value={tab.value} />
                    ))}
                </Tabs>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
