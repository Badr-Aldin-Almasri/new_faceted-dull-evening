var express = require('express');
var router = express.Router();
var url=require('url');

/* GET home page. */ 

/// created_at

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
connection.query('SELECT COUNT(id) As num FROM '+queryData['type']+' Where status != "2" AND status != "3" AND status != "4" ',function(error,results,fields){
connection.query('SELECT created_at FROM '+queryData['type']+' Where status != "2" AND status != "3" AND status != "4" ORDER BY created_at ASC limit 1',function(error,data,fields){
//    console.log(error);
  var b ;
   try {
     
     b =JSON.parse(JSON.stringify(data[0]['created_at']));
     }
  catch (e) {
    b = "2022-12-29T21:53:29.000Z";
    }
  
// connection.query('SELECT is_auction, CASE WHEN is_auction = 0 THEN "direct sell" WHEN is_auction = 1 THEN "'+b+'"  END AS created_at FROM mains where type="'+queryData['type']+'"' ,function(error,ress,fields){
  //   console.log(b);
     res.json({results,b});
   
// });
});
});
});


module.exports = router;
