const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;  // or whatever port you're using

// Serve static files from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});