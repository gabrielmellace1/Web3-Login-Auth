const mysql = require('mysql2/promise');

let pool;

(async function initializePool() {
    pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'authmodule',
        password: '',
    });
})();

module.exports = {
    authenticate: async function (userAddress, signature) {
        const [rows] = await pool.query('SELECT * FROM users WHERE userAddress = ?', [userAddress]);

        // If the user doesn't exist, create them.
        if (rows.length === 0) {
            const apiKey = Math.random().toString(36).substring(2, 15); // Generate a random API key
            await pool.query('INSERT INTO users (userAddress, signature, apiKey, createdAt) VALUES (?, ?, ?, ?)', [userAddress, signature, apiKey, new Date()]);
            return { success: true, apiKey: apiKey };
        }

        const user = rows[0];

        // If the signature doesn't match, return an error.
        if (user.signature !== signature) {
            return { success: false, error: 'Invalid signature' };
        }

        // The user is authenticated and the API key is returned.
        return { success: true, apiKey: user.apiKey };
    },

    verify: async function (userAddress, apiKey) {
        const [rows] = await pool.query('SELECT * FROM users WHERE userAddress = ?', [userAddress]);

        if (rows.length === 0 || rows[0].apiKey !== apiKey) {
            return { success: false, error: 'Invalid API key' };
        }

        const user = rows[0];

        const timeSinceKeyCreation = new Date() - user.createdAt;

        if (timeSinceKeyCreation > 24 * 60 * 60 * 1000) {
            // If the API key is older than 24 hours, delete it
            await pool.query('DELETE FROM users WHERE userAddress = ?', [userAddress]);
            return { success: false, error: 'API key expired' };
        }

        return { success: true };
    }
}
