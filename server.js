const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }))

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

app.get('/exercise-3',(req,res)=>{
    res.render('./pages/exercise3.ejs');
})

app.get('/exercise-3/resultpage', (req, res) => {
    const query = req.query.string;
    res.render('resultpage.ejs', { query });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
