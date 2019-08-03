/*********************************************************** 
 * Author: Helen Tran
 * Course: CS290
 * Date: August 1, 2019
 * Description: final project
 ************************************************************/
const express = require('express');
const path = require('path');
const app = express();
const handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});
const bodyParser = require('body-parser');
const PORT = 3000;

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/log', (req, res) => {
    res.render('log');
});

app.get('/resources', (req, res) => {
    res.render('resources');
});

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

// prints a log once the server starts listening
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}; press Ctrl-C to terminate.`)
})