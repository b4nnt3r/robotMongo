const express = require('express');
const passport = require('passport');
const mustacheExpress = require('mustache-express');
let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://127.0.0.1:27017/robotdb';

const app = express();

app.use(express.static('public'))

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

let findAll = function(callback) {
  MongoClient.connect(url, function(err, db) {
    let collection = db.collection('robots');
    collection.find().toArray(function(err, result) {
      console.log("found", result.length, "robots");
      callback(result);
    });
  });
}

let findJobless = function(callback) {
  MongoClient.connect(url, function(err, db) {
    let collection = db.collection('robots');
    collection.find({
      "job": null
    }).toArray(function(err, result) {
      console.log("found", result.length, "robots");
      callback(result);
    });
  });
}

let findEmployed = function(callback) {
  MongoClient.connect(url, function(err, db) {
    let collection = db.collection('robots');
    collection.find({
      "company": {
        $ne: null
      }
    }).toArray(function(err, result) {
      console.log("found " + result.length + " robots");
      callback(result);
    });
  });
}

app.get('/', function(req, res) {
  findAll(function(result) {
    res.render('index', {
      robots: result
    });
  });
});

app.get('/afh', function(req, res) {
  findJobless(function(result) {
    res.render('index', {
      robots: result
    });
  });
});

app.get('/employed', function(req, res) {
  findEmployed(function(result) {
    res.render('index', {
      robots: result
    });
  });
});

app.get('/:id', function(req, res) {
  MongoClient.connect(url, function(err, db) {

    let collection = db.collection('robots');
    let robot = collection.findOne({
      username: req.params.id
    }).then(function(result) {
      console.log("Heres the result", result);
      result;
      res.render("details", {
        robots: result
      });
    });
    console.log("Heres the robot", robot);
  });
});

app.listen(3000, function() {
  console.log('Robot app listening on port 3000');
});
