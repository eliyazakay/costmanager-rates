// db.js
// Vanilla JavaScript library for the Cost Manager application.
// Attaches the db object to the global (window) scope via <script> tag.

/*
 * Module pattern using an IIFE to encapsulate all internal state
 * while exposing only the public API through the returned object.
 * This avoids polluting the global scope beyond the single db property.
 */
window.db = (function () {

    // Tracks the currently active database name set by openCostsDB
    let activeDBName = null;

    // Default exchange rates relative to USD (e.g. ILS:3.4 means 3.4 ILS = 1 USD)
    const DEFAULT_RATES = { USD: 1, GBP: 0.6, EURO: 0.7, ILS: 3.4 };

    // localStorage key used to cache the most recently fetched exchange rates
    const RATES_KEY = 'cm_exchange_rates';

    // Retrieves cached exchange rates from localStorage, falling back to defaults
    function getExchangeRates() {
        const stored = localStorage.getItem(RATES_KEY);
        // Return parsed rates if previously cached, otherwise use built-in defaults
        if (stored) {
            return JSON.parse(stored);
        }
        return DEFAULT_RATES;
    }

    /*
     * Converts a monetary amount from one currency to another.
     * All conversions route through USD as the common base currency.
     * Rate meaning: rate[currency] units of that currency equal 1 USD.
     */
    function convertCurrency(amount, fromCurrency, toCurrency) {
        const rates = getExchangeRates();
        // Convert source amount to USD first, then to the target currency
        const amountInUSD = amount / rates[fromCurrency];
        return amountInUSD * rates[toCurrency];
    }

    /*
     * Opens or initializes a named cost database stored in localStorage.
     * Returns a database object exposing the addCost method.
     */
    function openCostsDB(databaseName, databaseVersion) {
        // Store the active DB name so getReport can access the same data
        activeDBName = databaseName;

        // Initialize with an empty array if this database has not been created yet
        if (!localStorage.getItem(databaseName)) {
            localStorage.setItem(databaseName, JSON.stringify([]));
        }

        // Return the database object with the addCost method attached
        return {
            /*
             * Adds a new cost item to the active database.
             * The current date is automatically attached to the item.
             */
            addCost: function (cost) {
                const costs = JSON.parse(localStorage.getItem(activeDBName) || '[]');
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

                // Persist the updated costs array back to localStorage
                costs.push(newCost);
                localStorage.setItem(activeDBName, JSON.stringify(costs));
                return newCost;
            }
        };
    }

    /*
     * Generates a cost report for a specific month, year, and display currency.
     * Defaults to the current month and year when those arguments are omitted.
     * Uses cached exchange rates from localStorage for all currency conversions.
     */
    function getReport(currency, year, month) {
        if (!activeDBName) {
            throw new Error('No database is open. Call openCostsDB first.');
        }

        const now = new Date();
        // Fall back to current year and month if not explicitly provided
        const targetYear = (year !== undefined) ? year : now.getFullYear();
        const targetMonth = (month !== undefined) ? month : (now.getMonth() + 1);

        // Load the full cost list from localStorage
        const allCosts = JSON.parse(localStorage.getItem(activeDBName) || '[]');

        // Keep only the costs that belong to the requested month and year
        const filteredCosts = allCosts.filter(
            cost => cost.date.year === targetYear && cost.date.month === targetMonth
        );

        // Accumulate the total by converting each cost to the requested currency
        let totalSum = 0;
        filteredCosts.forEach(cost => {
            totalSum += convertCurrency(cost.sum, cost.currency, currency);
        });

        // Round the total to two decimal places for clean output
        totalSum = Math.round(totalSum * 100) / 100;

        return {
            year: targetYear,
            month: targetMonth,
            costs: filteredCosts,
            total: { currency: currency, sum: totalSum }
        };
    }

    // Expose only the public API of the db module
    return {
        openCostsDB: openCostsDB,
        getReport: getReport
    };

}());
