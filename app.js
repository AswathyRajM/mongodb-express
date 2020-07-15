
const express = require('express');
const MongoClient = require('mongodb').MongoClient
const bodyParser= require('body-parser')
var cors = require("cors");
const { query } = require('express');
const app = express();
var url = "mongodb://localhost:27017/mydb";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
  if (err) return console.log(err)

  app.listen(4444, () => {
    console.log('app working on 4444')
  });

  let dbase = db.db("concatdb");

  app.post('/concat/new', (req, res, next) => {

    let name = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        fullName: req.body.firstName + " " + req.body.lastName 
    }
    
    const firstName = name.firstName
    const lastName = name.lastName
    const query = { firstName: firstName , lastName : lastName };
    dbase.collection('name').find(query,{projection:{_id:0}}).toArray((err, results) => {
        if (err) throw err;

        if(results.length > 0){
            res.send("Exists")
        }
        else{
            dbase.collection("name").insertOne(name, (err, results) => {
                if(err) {
                  console.log(err);
                }
                res.send("Added");
              });
        }
    })
  });

  app.get('/concat', (req, res, next) => {
    const firstName = req.query.firstName
    const lastName = req.query.lastName
    const query = { firstName: firstName , lastName : lastName };
    dbase.collection('name').find(query,{projection:{_id:0}}).toArray((err, result) => {
      if (err) throw err;
      if(result.length > 0){
        res.send("OK")
      }
      else res.send("NO entry")
    });
  });

});
