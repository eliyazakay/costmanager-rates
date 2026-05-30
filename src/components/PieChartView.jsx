// PieChartView.jsx
// Displays a pie chart of total costs grouped by category
// for a user-selected month, year, and display currency.

import { useState } from 'react';
import {
    Box, Button, Card, CardContent, CircularProgress,
    FormControl, InputLabel, MenuItem, Select, Typography, Alert
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getReport } from '../db';

// Supported display currencies
const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];

// Month names for the month selector
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const SLICE_COLORS = [
    '#64b5f6', '#ef5350', '#66bb6a', '#ffa726',
    '#ab47bc', '#26c6da', '#ec407a', '#8d6e63'
];

// Build a list of recent years for the year selector
const buildYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

/*
 * Aggregates a flat list of cost items into totals grouped by category.
 * Returns an array of { name, value } objects ready for Recharts.
 */
function buildChartData(costs, currency, rates) {
    const totals = {};

    // Sum each cost into the correct category bucket
    costs.forEach(cost => {
        const amountInUSD = cost.sum / rates[cost.currency];
        const converted = amountInUSD * rates[currency];

        if (!totals[cost.category]) {
            totals[cost.category] = 0;
        }
        totals[cost.category] += converted;
    });

    // Convert the totals map to the array format Recharts expects
    return Object.entries(totals).map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100
    }));
}

/*
 * PieChartView lets the user pick a month, year, and currency,
 * then renders a Recharts PieChart grouped by cost category.
 */
function PieChartView({ dbName }) {
    const now = new Date();

    // Selector state — default to the current month and year
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [currency, setCurrency] = useState('USD');

    // Chart data and UI state
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const yearOptions = buildYearOptions();

    // Fetches the monthly report and transforms it into chart data
    const handleGetChart = async () => {
        setLoading(true);
        setError(null);
        setChartData(null);

        try {
            const reportData = await getReport(dbName, currency, year, month);

            // Use cached rates (already fetched inside getReport) for conversion
            const cached = localStorage.getItem('cm_exchange_rates');
            const rates = cached
                ? JSON.parse(cached)
                : { USD: 1, GBP: 0.6, EURO: 0.7, ILS: 3.4 };

            const data = buildChartData(reportData.costs, currency, rates);
            setChartData(data);
        } catch (err) {
            setError('Failed to load chart data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card elevation={0}>
            <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
                <Typography variant='h5' gutterBottom>
                    Costs by Category - Pie Chart
                </Typography>

                {/* Selectors row */}
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

                    {/* Currency selector */}
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
                        sx={{ height: 56, whiteSpace: 'nowrap' }}
                    >
                        Show Chart
                    </Button>
                </Box>

                {/* Loading spinner */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Error message */}
                {error && <Alert severity='error'>{error}</Alert>}

                {/* Pie chart rendered when data is available */}
                {chartData && chartData.length === 0 && (
                    <Typography color='text.secondary'>
                        No costs found for {MONTH_NAMES[month - 1]} {year}.
                    </Typography>
                )}

                {chartData && chartData.length > 0 && (
                    <ResponsiveContainer width='100%' height={400}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey='value'
                                nameKey='name'
                                cx='50%'
                                cy='50%'
                                outerRadius={140}
                                labelLine={{ stroke: 'rgba(255,255,255,0.4)' }}
                                label={({ name, percent, x, y }) => (
                                    <text
                                        x={x}
                                        y={y}
                                        fill='rgba(255,255,255,0.9)'
                                        textAnchor='middle'
                                        dominantBaseline='central'
                                        fontSize={12}
                                    >
                                        {`${name} ${(percent * 100).toFixed(1)}%`}
                                    </text>
                                )}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={value => `${value} ${currency}`}
                                contentStyle={{
                                    background: 'rgba(10, 20, 50, 0.92)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: 8,
                                    color: 'white'
                                }}
                                itemStyle={{ color: 'rgba(255,255,255,0.87)' }}
                            />
                            <Legend
                                formatter={(value) => (
                                    <span style={{ color: 'rgba(255,255,255,0.85)' }}>{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

export default PieChartView;
