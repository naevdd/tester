const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/exercise-2',(req,res)=>{
    res.redirect('/exercise-2-redirected');
});

app.get('/exercise-2-redirected',(req,res)=>{
    res.send('redirected to this page');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
