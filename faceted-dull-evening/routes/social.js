var express = require('express');
var router = express.Router();
var url=require('url');
var admin = require("firebase-admin");

  var serviceAccount = require("../saudi-auction-a819c-firebase-adminsdk-pxnwv-64e3e23072.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
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
  connection.query( "SELECT `name`, `photo`, `link` FROM social  " ,function(error,results,fields){
      console.log(results);
       res.json(results);
  });
   });
router.post('/', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
 connection.query("INSERT INTO social (`name`, `photo`, `link`) VALUES ('"+queryData['name']+"','"+queryData['photo']+"','"+queryData['link']+"')   ",function(error,results,fields){
   console.log(error);                     
    res.json(results);                              
 });
    });
router.post('/update_social', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
// connection.query('UPDATE social SET name="+json_data['name']+",photo="+json_data['photo']+",link="+json_data['link']+" WHERE id='+queryData['id']+ '' ,function(error,results,fields){
 connection.query("UPDATE social SET name ='"+queryData['name']+"',photo= '"+queryData['photo']+"',link='"+queryData['link']+"',name,photo,link) WHERE id="+queryData['id']+" ",function(error,results,fields){

   console.log(error);                       
    res.json(results);                              
 });
    });


module.exports = router;
