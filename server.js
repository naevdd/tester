const express = require('express');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs");

app.set('trust proxy', true);

function isMarkdown(text) {
    // Simplified and more lenient patterns
    const markdownPatterns = [
      /^#+\s*.+/m,        // Headers (allows space after # to be optional)
      /\*\*.+?\*\*/,      // Bold
      /\*.+?\*/,          // Italic
      /\[.+?\]\(.+?\)/,   // Links
      /^[-*+]\s+.+/m,     // Unordered lists
      /^\d+\.\s+.+/m,     // Ordered lists
      /^```[\s\S]*?^```/m,// Code blocks
      /`.+?`/,            // Inline code
      /!\[.+?\]\(.+?\)/,  // Images
      /^>\s*.+/m,         // Blockquotes
      /^-{3,}$/m,         // Horizontal rules
      /\|.+\|/            // Tables (basic check)
    ];
  
    return markdownPatterns.some(pattern => pattern.test(text));
  }

const csvFilePath = path.join(__dirname, 'search_log.csv');

if (!fs.existsSync(csvFilePath)) {
    fs.writeFileSync(csvFilePath, 'Search String,Date Time (IST),IP Address,Browser\n');
  }  

const writer = csvWriter({
  path: csvFilePath,
  header: [
    {id: 'searchString', title: 'Search String'},
    {id: 'dateTime', title: 'Date Time (IST)'},
    {id: 'ipAddress', title: 'IP Address'},
    {id: 'userAgent', title: 'Browser'}
  ],
  append: true
});

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

app.get('/exercise-4', (req, res) => {
    res.render('./pages/exercise4.ejs', { query: null, rows: [], page: 1, totalPages: 1 });
});

function getBrowserName(userAgent) {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown Browser";
}

app.post('/clear-history', (req, res) => {
    fs.truncate(csvFilePath, 0, (err) => {
        if (err) {
            console.error('Error clearing search history:', err);
            return res.status(500).send('Failed to clear search history.');
        }
        console.log('Search history cleared successfully.');
        res.redirect('/exercise-4');
    });
});

app.post('/exercise-4/result4', (req, res) => {
    const searchString = req.body.string;
    const dateTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    const browser = getBrowserName(userAgent);

    if (searchString) {
        const newEntry = `${searchString},${dateTime},${ipAddress},${browser}\n`;
        fs.appendFileSync(csvFilePath, newEntry);
    }

    fs.readFile(csvFilePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading search history:', err);
            return res.status(500).send('Failed to load search history.');
        }

        const rows = fileData.trim().split('\n').map(row => row.split(','));

        const totalEntries = rows.length;
        const page = parseInt(req.query.page) || 1;
        const entriesPerPage = 10;
        const totalPages = Math.ceil(totalEntries / entriesPerPage);

        const paginatedRows = rows.slice((page - 1) * entriesPerPage, page * entriesPerPage);

        res.render('result4.ejs', { query: searchString, rows: paginatedRows, page, totalPages });
    });
});

app.get('/exercise-5',(req,res)=>{
    res.render('./pages/exercise5.ejs');
});

app.get('/exercise-5/post',(req,res)=>{
    res.render('resultblog5.ejs');
});

app.post('/exercise-5/submission',(req,res)=>{
    const text=req.body.bloginput;
    if(!isMarkdown(text)){
        res.send("Error: The submitted content is not in markdown.")
    }
    else{
        let date_time = new Date();
        let date = ("0" + date_time.getDate()).slice(-2);
        let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
        let year = date_time.getFullYear();
        let hours = date_time.getHours();
        let minutes = date_time.getMinutes();
        let seconds = date_time.getSeconds();

        let filename=year+month+date+hours+minutes+seconds+".md";
        const fullpath="./markdown/"+filename
        fs.appendFile(fullpath, text, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.render('./pages/exercise5.ejs');
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
