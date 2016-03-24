var appURL = "http://52.33.199.213";

var express = require('express');
var request = require('request');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/',function(req,res,next){
  var context = {};
  res.render('home', context);
});

app.post('/',function(req,res,next){
  var context = {};
  console.log(req.body.id);
  res.render('home',context);
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, req.body.date || curVals.date, req.body.lbs || curVals.lbs, req.body.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
      });
    }
  });
});

app.get('/edit',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT id, name, reps, weight, date, lbs FROM workouts WHERE id=?',[req.query.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.id = rows[0].id;
    context.name = rows[0].name;
    context.reps = rows[0].reps;
    context.weight = rows[0].weight;
    var d = new Date(rows[0].date);
    context.date = d.getFullYear() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getDate();
    context.lbs = rows[0].lbs;
    res.render('edit', context);
  });
});


app.get('/data',function(req,res,next){
  // console.log('/data WAS CALLED'); // DEBUG
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    res.type('text/json');
    res.status(200);
    res.send(JSON.stringify(rows));
  });
});

app.get('/addExercise',function(req,res,next){
  mysql.pool.query("INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name,req.query.reps,req.query.weight,req.query.date,req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
    res.type('text/plain');
    res.status(200);
    res.send(null);
  });
});

app.get('/deleteExercise',function(req,res,next){
  mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    res.type('text/plain');
    res.status(200);
    res.send(null);
  });
});


app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      // context.results = err;
      res.render('home',context);
    });
  });
});

app.listen(app.get('port'), function(){
  console.log('Express started on ' + appURL + ":" + app.get('port') + '; press Ctrl-C to terminate.');
});
