var express = require('express');
var router = express.Router();
var url=require('url');

/* GET home page. */



var mysql=require('mysql');
var connection = mysql.createPool({
host:'localhost',
connectionLimit : 10,
user :'admin_default',
password:'aaaaaaa',
debug    :  false,
database:'admin_default'
});
//connection.connect();

router.get('/', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query( "SELECT * FROM term " ,function(error,results,fields){
      console.log("okk");
       res.json(results);
  });
   });
router.post('/', function(req, res, next) {
// var queryData=url.parse(req.url,true).query;
var queryData= req.body;
connection.query("UPDATE term SET terms = '"+queryData['terms']+"' ",function(error,results,fields){
   console.log(error);
    res.json(results);                              
 });
    });


module.exports = router;
