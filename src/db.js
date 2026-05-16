// src/db.js
// ES module version of the Cost Manager database library.
// Used by React components via import statements.

// Default exchange rates relative to USD (e.g. ILS:3.4 means 3.4 ILS = 1 USD)
const DEFAULT_RATES = { USD: 1, GBP: 0.6, EURO: 0.7, ILS: 3.4 };

// localStorage keys for costs, cached rates, and the settings URL
const RATES_KEY = 'cm_exchange_rates';
const RATES_URL_KEY = 'cm_rates_url';

// The default URL for fetching exchange rates (static JSON hosted by the team)
const DEFAULT_RATES_URL = 'https://eliyazakay.github.io/costmanager-rates/rates.json';

/*
 * Fetches the latest exchange rates from the configured URL and caches them
 * in localStorage so that getReport can use them synchronously.
 * Falls back to default rates if the fetch fails for any reason.
 */
async function fetchAndCacheRates() {
    // Read the user-configured URL from settings, or use the default
    const url = localStorage.getItem(RATES_URL_KEY) || DEFAULT_RATES_URL;

    try {
        const response = await fetch(url);
        // Throw an error if the server returned a non-OK status
        if (!response.ok) {
            throw new Error(`Rates fetch failed with status ${response.status}`);
        }
        const rates = await response.json();
        // Persist the fetched rates so other functions can use them
        localStorage.setItem(RATES_KEY, JSON.stringify(rates));
        return rates;
    } catch (error) {
        // On failure, return whatever is cached or the built-in defaults
        console.error('Could not fetch exchange rates:', error);
        const cached = localStorage.getItem(RATES_KEY);
        return cached ? JSON.parse(cached) : DEFAULT_RATES;
    }
}

// Returns the most recently cached exchange rates, or the built-in defaults
function getCachedRates() {
    const stored = localStorage.getItem(RATES_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return DEFAULT_RATES;
}

/*
 * Converts a monetary amount from one currency to another.
 * All conversions route through USD as the common base currency.
 * Rate meaning: rates[currency] units of that currency equal 1 USD.
 */
function convertCurrency(amount, fromCurrency, toCurrency, rates) {
    // Convert the source amount to USD, then to the target currency
    const amountInUSD = amount / rates[fromCurrency];
    return amountInUSD * rates[toCurrency];
}

/*
 * Opens or initializes a named cost database stored in localStorage.
 * Returns a database object exposing the addCost method.
 * Kicks off an async fetch of the latest exchange rates in the background.
 */
function openCostsDB(databaseName, databaseVersion) {
    // Initialize with an empty array if this database does not exist yet
    if (!localStorage.getItem(databaseName)) {
        localStorage.setItem(databaseName, JSON.stringify([]));
    }

    // Refresh exchange rates in the background without blocking the caller
    fetchAndCacheRates();

    // Return the database object bound to this specific database name
    return {
        /*
         * Adds a new cost item and persists it in localStorage.
         * The current date is automatically attached to the item.
         */
        addCost: function (cost) {
            const costs = JSON.parse(localStorage.getItem(databaseName) || '[]');
            const now = new Date();

            // Build the complete cost object including today's date
            const newCost = {
                sum: cost.sum,
                currency: cost.currency,
                category: cost.category,
                description: cost.description,
                date: {
                    day: now.getDate(),
                    month: now.getMonth() + 1,
                    year: now.getFullYear()
                }
            };

            // Save the updated costs array back to localStorage
            costs.push(newCost);
            localStorage.setItem(databaseName, JSON.stringify(costs));
            return newCost;
        }
    };
}

/*
 * Generates a cost report for a specific month, year, and display currency.
 * Fetches the latest exchange rates from the server before calculating totals.
 * Defaults to the current month and year when those arguments are omitted.
 */
async function getReport(dbName, currency, year, month) {
    const now = new Date();
    // Use current year and month as defaults when not explicitly provided
    const targetYear = (year !== undefined) ? year : now.getFullYear();
    const targetMonth = (month !== undefined) ? month : (now.getMonth() + 1);

    // Fetch fresh rates from the server before building the report
    const rates = await fetchAndCacheRates();

    // Load the full cost list from localStorage
    const allCosts = JSON.parse(localStorage.getItem(dbName) || '[]');

    // Keep only costs that belong to the requested month and year
    const filteredCosts = allCosts.filter(
        cost => cost.date.year === targetYear && cost.date.month === targetMonth
    );

    // Sum all costs after converting each one to the requested currency
    let totalSum = 0;
    filteredCosts.forEach(cost => {
        totalSum += convertCurrency(cost.sum, cost.currency, currency, rates);
    });

    // Round the total to two decimal places
    totalSum = Math.round(totalSum * 100) / 100;

    return {
        year: targetYear,
        month: targetMonth,
        costs: filteredCosts,
        total: { currency: currency, sum: totalSum }
    };
}

/*
 * Generates a yearly summary showing total costs per month.
 * Used by the Bar Chart feature.
 */
async function getYearlySummary(dbName, currency, year) {
    const targetYear = year !== undefined ? year : new Date().getFullYear();

    // Fetch fresh exchange rates before calculating
    const rates = await fetchAndCacheRates();
    const allCosts = JSON.parse(localStorage.getItem(dbName) || '[]');

    // Build a 12-entry array, one total per month
    const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        total: 0
    }));

    // Accumulate costs into the correct month bucket
    allCosts.forEach(cost => {
        if (cost.date.year === targetYear) {
            const index = cost.date.month - 1;
            monthlyTotals[index].total += convertCurrency(
                cost.sum, cost.currency, currency, rates
            );
        }
    });

    // Round each monthly total to two decimal places
    monthlyTotals.forEach(entry => {
        entry.total = Math.round(entry.total * 100) / 100;
    });

    return { year: targetYear, currency: currency, months: monthlyTotals };
}

/*
 * Saves a custom exchange rate URL to localStorage.
 * This URL is used by all subsequent calls to fetchAndCacheRates.
 */
function saveRatesUrl(url) {
    localStorage.setItem(RATES_URL_KEY, url);
}

// Returns the currently saved exchange rate URL, or the default
function getRatesUrl() {
    return localStorage.getItem(RATES_URL_KEY) || DEFAULT_RATES_URL;
}

export {
    openCostsDB,
    getReport,
    getYearlySummary,
    fetchAndCacheRates,
    saveRatesUrl,
    getRatesUrl,
    getCachedRates
};
