// MonthlyReport.jsx
// Displays a detailed cost report for a user-selected month, year, and currency.
// Fetches fresh exchange rates before calculating the total.

import { useState } from 'react';
import {
    Box, Button, Card, CardContent, CircularProgress, FormControl,
    InputLabel, MenuItem, Select, Table, TableBody, TableCell,
    TableHead, TableRow, Typography, Alert, Divider
} from '@mui/material';
import { getReport } from '../db';

// Supported display currencies
const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];

// Month names used to build the month selector
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Build a list of recent years for the year selector (current year ± 4)
const buildYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

/*
 * MonthlyReport allows the user to select a month, year, and display currency,
 * then fetches and displays all costs for that period along with the total.
 */
function MonthlyReport({ dbName }) {
    const now = new Date();

    // Selector state — default to the current month, year, and USD
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [currency, setCurrency] = useState('USD');

    // Report data and UI state
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const yearOptions = buildYearOptions();

    // Fetches the report from the db module and updates state
    const handleGetReport = async () => {
        setLoading(true);
        setError(null);
        setReportData(null);

        try {
            const data = await getReport(dbName, currency, year, month);
            setReportData(data);
        } catch (err) {
            setError('Failed to load report. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card elevation={3}>
            <CardContent>
                <Typography variant='h5' gutterBottom fontWeight={600}>
                    Monthly Report
                </Typography>

                {/* Selectors row: month, year, and display currency */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Month</InputLabel>
                        <Select
                            value={month}
                            label='Month'
                            onChange={e => setMonth(Number(e.target.value))}
                        >
                            {MONTH_NAMES.map((name, index) => (
                                <MenuItem key={name} value={index + 1}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Year selector */}
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={year}
                            label='Year'
                            onChange={e => setYear(Number(e.target.value))}
                        >
                            {yearOptions.map(y => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Display currency selector */}
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Currency</InputLabel>
                        <Select
                            value={currency}
                            label='Currency'
                            onChange={e => setCurrency(e.target.value)}
                        >
                            {CURRENCIES.map(c => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant='contained'
                        onClick={handleGetReport}
                        disabled={loading}
                        sx={{ alignSelf: 'center' }}
                    >
                        Get Report
                    </Button>
                </Box>

                {/* Loading spinner shown while fetching */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Error alert shown on fetch failure */}
                {error && <Alert severity='error'>{error}</Alert>}

                {/* Report results table */}
                {reportData && (
                    <Box>
                        <Divider sx={{ mb: 2 }} />

                        {reportData.costs.length === 0 ? (
                            <Typography color='text.secondary'>
                                No costs found for {MONTH_NAMES[month - 1]} {year}.
                            </Typography>
                        ) : (
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Day</strong></TableCell>
                                        <TableCell><strong>Category</strong></TableCell>
                                        <TableCell><strong>Description</strong></TableCell>
                                        <TableCell align='right'><strong>Sum</strong></TableCell>
                                        <TableCell><strong>Currency</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Render one row per cost item */}
                                    {reportData.costs.map((cost, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{cost.date.day}</TableCell>
                                            <TableCell>{cost.category}</TableCell>
                                            <TableCell>{cost.description}</TableCell>
                                            <TableCell align='right'>{cost.sum}</TableCell>
                                            <TableCell>{cost.currency}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Total row displayed below the table */}
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
                            <Typography variant='h6'>
                                Total: {reportData.total.sum} {reportData.total.currency}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default MonthlyReport;
