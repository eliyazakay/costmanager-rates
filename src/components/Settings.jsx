// Settings.jsx
// Allows the user to configure a custom URL for fetching exchange rates.
// The URL is saved to localStorage and used by all subsequent rate fetches.

import { useState, useEffect } from 'react';
import {
    Alert, Box, Button, Card, CardContent,
    TextField, Typography, Divider
} from '@mui/material';
import { saveRatesUrl, getRatesUrl, fetchAndCacheRates } from '../db';

/*
 * Settings renders a simple form where the user can enter and save a
 * custom exchange rate URL. On save the new rates are fetched immediately
 * so the rest of the app uses them without requiring a page reload.
 */
function Settings() {
    // Pre-populate the field with whatever URL is currently configured
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState(null);

    // Load the current URL from the db module when the component mounts
    useEffect(() => {
        setUrl(getRatesUrl());
    }, []);

    // Saves the URL and immediately fetches fresh exchange rates
    const handleSave = async () => {
        setMessage(null);

        // Trim whitespace before saving
        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
            setMessage({ type: 'error', text: 'Please enter a valid URL.' });
            return;
        }

        // Persist the new URL and refresh rates from the server
        saveRatesUrl(trimmedUrl);

        try {
            await fetchAndCacheRates();
            setMessage({ type: 'success', text: 'Settings saved and rates updated successfully!' });
        } catch (err) {
            // URL was saved even if the fetch failed — rates will be retried later
            setMessage({ type: 'warning', text: 'URL saved, but fetching rates failed. Check the URL.' });
            console.error(err);
        }
    };

    return (
        <Card elevation={3}>
            <CardContent>
                <Typography variant='h5' gutterBottom fontWeight={600}>
                    Settings
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Typography variant='subtitle1' gutterBottom>
                    Exchange Rate Source URL
                </Typography>

                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Enter the URL of a JSON endpoint that returns exchange rates in the
                    following format: {`{"USD":1,"GBP":0.6,"EURO":0.7,"ILS":3.4}`}
                </Typography>

                {/* Feedback alert shown after a save attempt */}
                {message && (
                    <Alert severity={message.type} sx={{ mb: 2 }}>
                        {message.text}
                    </Alert>
                )}

                {/* URL text field */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <TextField
                        label='Exchange Rate URL'
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        fullWidth
                        placeholder='https://example.com/rates.json'
                    />

                    <Button
                        variant='contained'
                        onClick={handleSave}
                        sx={{ mt: 1, whiteSpace: 'nowrap' }}
                    >
                        Save & Refresh
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default Settings;
