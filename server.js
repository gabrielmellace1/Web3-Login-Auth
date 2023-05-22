const express = require('express');
const path = require('path');
const authModule = require('./authModule');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/auth', async (req, res) => {
    const { userAddress, signature } = req.body;
    const authResult = await authModule.authenticate(userAddress, signature);

    res.json(authResult);
});

app.post('/verify', async (req, res) => {
    const { userAddress, apiKey } = req.body;
    const verifyResult = await authModule.verify(userAddress, apiKey);

    res.json(verifyResult);
});

app.get('/protected', async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    const userAddress = req.headers['x-user-address'];

    const verifyResult = await authModule.verify(userAddress, apiKey);

    if (!verifyResult.success) {
        return res.json(verifyResult);
    }

    res.json({ success: true, message: 'You have accessed a protected route!' });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
