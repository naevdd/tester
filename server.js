const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/exercise-2',(req,res)=>{
    res.redirect('/exercise-2-redirected');
});

app.get('/exercise-2-redirected',(req,res)=>{
    res.send('Exercise 2 is redirected to this page.');
});

let searchHistory = [];

app.get('/exercise-3', (req, res) => {
    res.render('./pages/exercise3.ejs', { history: searchHistory });
});

app.post('/exercise-3', (req, res) => {
    const query = req.body.string;
    searchHistory.push(query);
    res.render('resultpage.ejs', { query });
});

app.post('/clear-history', (req, res) => {
    searchHistory = [];
    res.redirect('/exercise-3');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
