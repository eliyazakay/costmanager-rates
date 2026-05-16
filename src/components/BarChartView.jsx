// BarChartView.jsx
// Displays a bar chart of total monthly costs for a user-selected year and currency.
// Each bar represents the total spending for one of the twelve months.

import { useState } from 'react';
import {
    Box, Button, Card, CardContent, CircularProgress,
    FormControl, InputLabel, MenuItem, Select, Typography, Alert
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { getYearlySummary } from '../db';

// Supported display currencies
const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];

// Short month labels for the X-axis of the bar chart
const MONTH_LABELS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Bar fill color — uses the primary theme color
const BAR_COLOR = '#1565c0';

// Build a list of recent years for the year selector
const buildYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

/*
 * BarChartView lets the user pick a year and currency, then renders a
 * Recharts BarChart showing the total spending per month for that year.
 */
function BarChartView({ dbName }) {
    const now = new Date();

    // Selector state — default to the current year and USD
    const [year, setYear] = useState(now.getFullYear());
    const [currency, setCurrency] = useState('USD');

    // Chart data and UI state
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const yearOptions = buildYearOptions();

    // Fetches the yearly summary and prepares data for Recharts
    const handleGetChart = async () => {
        setLoading(true);
        setError(null);
        setChartData(null);

        try {
            const summary = await getYearlySummary(dbName, currency, year);

            // Map the monthly totals to the format Recharts expects
            const data = summary.months.map((entry, index) => ({
                month: MONTH_LABELS[index],
                total: entry.total
            }));

            setChartData(data);
        } catch (err) {
            setError('Failed to load chart data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card elevation={3}>
            <CardContent>
                <Typography variant='h5' gutterBottom fontWeight={600}>
                    Monthly Totals — Bar Chart
                </Typography>

                {/* Selectors row: year and currency */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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

                    {/* Currency selector for converting all totals */}
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
                        onClick={handleGetChart}
                        disabled={loading}
                        sx={{ alignSelf: 'center' }}
                    >
                        Show Chart
                    </Button>
                </Box>

                {/* Loading indicator */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Error feedback */}
                {error && <Alert severity='error'>{error}</Alert>}

                {/* Bar chart rendered once data is ready */}
                {chartData && (
                    <ResponsiveContainer width='100%' height={400}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='month' />
                            {/* Y-axis label shows the selected currency */}
                            <YAxis
                                label={{
                                    value: currency,
                                    angle: -90,
                                    position: 'insideLeft',
                                    offset: -5
                                }}
                            />
                            <Tooltip formatter={value => [`${value} ${currency}`, 'Total']} />
                            <Bar dataKey='total' name='Total'>
                                {/* Color every bar with the primary theme color */}
                                {chartData.map((_, index) => (
                                    <Cell key={`bar-${index}`} fill={BAR_COLOR} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

export default BarChartView;
