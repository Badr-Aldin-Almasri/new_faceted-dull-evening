var express = require('express');
var router = express.Router();
var url=require('url');
var mysql=require('mysql');

var connection = mysql.createPool({
    connectionLimit : 10,
host:'localhost',
user :'admin_default',
password:'aaaaaaa',
database:'admin_default'
});
//connection.connect();

router.post('/', function(req, res, next) {
    var queryData=url.parse(req.url,true).query;
   connection.query("INSERT INTO complains (`number`, `text`, `title`) VALUES ('"+queryData['number']+"','"+queryData['text']+"','"+queryData['title']+"')",function(error,results,fields){
   if(error){
  console.log(error);
    
   }else {
     console.log(results);
     res.send("ok");
   }
   });
  
  
});

module.exports = router;
