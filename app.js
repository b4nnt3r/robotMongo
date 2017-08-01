const express = require('express');
const mustacheExpress = require('mustache-express');
let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://127.0.0.1:27017/robotdb';

const app = express();

app.use(express.static('public'))

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

let findAll = function(db, callback) {
  let collection = db.collection('robots');
  collection.find().toArray(function(err, result) {
    console.log("found", result.length, "robots");
    callback(result);
  });
}

let findJobless = function(db, callback) {
  let collection = db.collection('robots');
  collection.find({
    "job": null
  }).toArray(function(err, result) {
    console.log("found", result.length, "robots");
    callback(result);
  });
}

let findEmployed = function(db, callback) {
  let collection = db.collection('robots');
  collection.find().toArray(function(err, result) {
    console.log("found", result.length, "robots");
    callback(result);
  });
}

app.get('/', function(request, response) {
  MongoClient.connect(url, function(err, db) {
    findAll(db, function(result) {
      response.render('index', {
        robots: result
      });
    });
  });
});

app.get('/afh', function(request, response) {
  MongoClient.connect(url, function(err, db) {
    findJobless(db, function(result) {
      response.render('index', {
        robots: result
      });
    });
  });
});

app.get('/employed', function(request, response) {
  MongoClient.connect(url, function(err, db) {
    findEmployed(db, function(result) {
      response.render('index', {
        robots: result
      });
    });
  });
});

app.listen(3000, function() {
  console.log('Robot app listening on port 3000');
});
