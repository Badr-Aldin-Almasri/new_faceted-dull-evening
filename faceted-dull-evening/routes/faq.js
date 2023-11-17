var express = require('express');
var router = express.Router();
var url=require('url');
var axios=require('axios');
var mysql=require('mysql');


var connection = mysql.createPool({
    connectionLimit : 10,
host:'localhost',
user :'admin_default',
password:'aaaaaaa',
database:'admin_default'
});
//connection.connect();


router.get('/', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query( "SELECT `Answer`, `Question` FROM faq " ,function(error,results,fields){
      console.log(results);
       res.json(results);
  });
   });
router.post('/', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
 connection.query("INSERT INTO faq (`Answer`, `Question`) VALUES ('"+queryData['Answer']+"','"+queryData['Question']+"')  ",function(error,results,fields){
   console.log(error);                                            
    res.json(results);                              
 });
    });


module.exports = router;
