/*********************************************************** 
 * Author: Helen Tran
 * Course: CS290
 * Date modified: August 27, 2019
 * Description: final project
 ************************************************************/
const express = require("express");
const mysql = require('./dbcon.js');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, 'public')));

// display home page
app.get('/', (req, res) => {
    res.render('index');
});

// query to display all columns in table
app.get('/log', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT *, DATE_FORMAT(date, '%m-%d-%Y') AS date FROM workouts", function (err, rows, fields) {
        if (err) {
            console.log("Could not display all");
            next(err);
            return;
        }
        var params = [];
        for (var item in rows) {
            var addWorkout = {
                'id': rows[item].id,
                'name': rows[item].name,
                'reps': rows[item].reps,
                'weight': rows[item].weight,
                'date': rows[item].date
            };

            if (rows[item].lbs) {
                addWorkout.lbs = "lbs";
            } else {
                addWorkout.lbs = "kg";
            }
            params.push(addWorkout);
        }
        context.workout = params;
        // render home page to show all data
        res.render('log', context);
    });
});


// query to insert data into table
app.get('/insert', function (req, res, next) {
    var context = {};
    mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?,?,?,?,?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.unit],
        function (err, result) {
            if (err) {
                console.log("Could not insert data");
                next(err);
                return;
            }
            context.inserted = result.insertId;
            // stringify to create JSON string
            res.send(JSON.stringify(context));
        });
});


// query to delete row
app.get('/delete', function (req, res, next) {
    var context = {};
    mysql.pool.query("DELETE FROM `workouts` WHERE id=?", [req.query.id], function (err, result) {
        if (err) {
            console.log("Could not delete");
            next(err);
            return;
        }
    });
});

// query to get the new data
app.get('/update', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", 
    [req.query.id], 
    function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        var params = [];
        for (var item in rows) {
            var addWorkout = {
                'id': rows[item].id,
                'name': rows[item].name,
                'reps': rows[item].reps,
                'weight': rows[item].weight,
                'date': rows[item].date,
                'lbs': rows[item].lbs
            };

            params.push(addWorkout);
        }
    
        context.workout = params[0];
        res.render('update', context);
    });
});

// perform a safe update and display updated data after returning from update form
app.get('/updatedEntry', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", 
    [req.query.id], 
    function (err, results) {
        if (err) {
            next(err);
            return;
        }
        if (results.length == 1) {
            var curVals = results[0];
            if(req.query.unit === "on"){
                req.query.unit = "1";
            }
            else{
                req.query.unit = "0";
            }
            
            mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",
                [req.query.name || curVals.name,
                    req.query.reps || curVals.reps,
                    req.query.weight || curVals.weight,
                    req.query.date || curVals.date,
                    req.query.unit,
                    req.query.id
                ],
                function (err, result) {
                    if (err) {
                        next(err);
                        return;
                    }
                    mysql.pool.query("SELECT *, DATE_FORMAT(date, '%m-%d-%Y') AS date FROM workouts", function (err, rows, fields) {
                        if (err) {
                            next(err);
                            return;
                        }
                        var params = [];
                        for (var item in rows) {
                            var addWorkout = {
                                'id': rows[item].id,
                                'name': rows[item].name,
                                'reps': rows[item].reps,
                                'weight': rows[item].weight,
                                'date': rows[item].date
                            };

                            if (rows[item].lbs) {
                                addWorkout.lbs = "lbs";
                            } else {
                                addWorkout.lbs = "kg";
                            }
                            params.push(addWorkout);
                        }
                        context.workout = params;
                        // render home page to show all data
                        res.render('log', context);
                    });
                });
        }
    });
});

// query to reset data in workout database provided by instructor
app.get('/reset-table', function (req, res, next) {
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS workouts", function (err) {
        var createString = "CREATE TABLE workouts(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function (err) {
            res.render('log', context);
        })
    });
});

app.get('/contact', (req, res) => {
    res.render('contact');
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
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});