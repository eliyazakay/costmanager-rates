// AddCostForm.jsx
// Form component that allows the user to add a new cost item.
// On submit the cost is persisted to localStorage via the db module.

import { useState } from 'react';
import {
    Box, Button, Card, CardContent, FormControl,
    InputLabel, MenuItem, Select, TextField, Typography, Alert
} from '@mui/material';

// Supported currencies as required by the project specification
const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];

// Available cost categories for the user to choose from
const CATEGORIES = [
    'Food', 'Education', 'Health', 'Entertainment',
    'Transportation', 'Shopping', 'Utilities', 'Other'
];

/*
 * AddCostForm renders a card with input fields for sum, currency,
 * category, and description. On submit it calls dbInstance.addCost
 * and shows a success or error message to the user.
 */
function AddCostForm({ dbInstance }) {
    // Form field state
    const [sum, setSum] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    // Feedback message shown after a submit attempt
    const [message, setMessage] = useState(null);

    // Resets all form fields to their initial empty state
    const resetForm = () => {
        setSum('');
        setCurrency('USD');
        setCategory('');
        setDescription('');
    };

    // Validates inputs and adds the cost item to the database
    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage(null);

        // Basic validation: sum must be a positive number
        const parsedSum = Number(sum);
        if (!sum || parsedSum <= 0 || isNaN(parsedSum)) {
            setMessage({ type: 'error', text: 'Please enter a valid positive sum.' });
            return;
        }

        // Category selection is required
        if (!category) {
            setMessage({ type: 'error', text: 'Please select a category.' });
            return;
        }

        // Description must not be empty
        if (!description.trim()) {
            setMessage({ type: 'error', text: 'Please enter a description.' });
            return;
        }

        // Persist the new cost item using the db module
        const result = dbInstance.addCost({
            sum: parsedSum,
            currency: currency,
            category: category,
            description: description.trim()
        });

        // Show success feedback and reset the form
        if (result) {
            setMessage({ type: 'success', text: 'Cost item added successfully!' });
            resetForm();
        }
    };

    return (
        <Card elevation={0}>
            <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
                <Typography variant='h5' gutterBottom>
                    Add New Cost
                </Typography>

                {/* Show feedback alert when a message exists */}
                {message && (
                    <Alert severity={message.type} sx={{ mb: 2 }}>
                        {message.text}
                    </Alert>
                )}

                <Box component='form' onSubmit={handleSubmit} noValidate>
                    {/* Sum and Currency on the same row */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            label='Sum'
                            type='number'
                            value={sum}
                            onChange={e => setSum(e.target.value)}
                            required
                            fullWidth
                            inputProps={{ min: 0, step: '0.01' }}
                        />

                        {/* Currency selector */}
                        <FormControl fullWidth required>
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
                    </Box>

                    {/* Category selector */}
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label='Category'
                            onChange={e => setCategory(e.target.value)}
                        >
                            {CATEGORIES.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Description text field */}
                    <TextField
                        label='Description'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        type='submit'
                        variant='contained'
                        size='large'
                        fullWidth
                    >
                        Add Cost
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default AddCostForm;
