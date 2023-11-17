var express = require('express');
var router = express.Router();
var url=require('url');
var admin = require("firebase-admin");

  var serviceAccount = require("../saudi-auction-a819c-firebase-adminsdk-pxnwv-64e3e23072.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
/* GET home page. */ 

/// created_at

// var mysql=require('mysql');
// var connection = mysql.createConnection({
// host:'sql6.freemysqlhosting.net',
// user :'sql6589341',
// password:'F7BdxJMUKm',
// database:'sql6589341'
// });
// connection.connect();
var mysql=require('mysql');
var connection = mysql.createPool({
    connectionLimit : 10,
host:'localhost',
user :'admin_default',
password:'aaaaaaa',
database:'admin_default'
});
//connection.connect();
router.post('/login', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query( "SELECT * FROM users WHERE mobile_id="+queryData['mobile_id']+" " ,function(error,results,fields){
    console.log(queryData);
       console.log(results);
   if (results!=null){ 
     connection.query(" UPDATE users SET gsm_token = '"+queryData['gsm_token']+"', gsm_token2 = '"+queryData['gsm_token2']+"' WHERE mobile_id="+queryData['mobile_id']+" ")
      console.log(results);
      console.log(error);
       res.json(results);
        } else  {
         res.json("notfound");
     } 
 });
});
router.post('/loginid', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query( "SELECT * FROM users WHERE id="+queryData['id']+" " ,function(error,results,fields){
   if (results!=null){ 
      console.log(results);
       res.json(results);
        } else  {
         res.json("notfound");
     } 
 });//login
});
router.get('/check_login', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query( "SELECT `mobile_id` FROM users WHERE mobile_id="+queryData['mobile_id']+" " ,function(error,results,fields){
    console.log(results);
    console.log(queryData['mobile_id']);
    if (results!=null && results.length != 0){ 
       res.json(true);
        } else  {
         res.json(false);
     } 
 });
});

router.post('/update_account', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
      
 // connection.query("INSERT INTO users (`name`, `gsm_token`, `gsm_token2`,`mobile_id`,`fav`,`email`) VALUES ('"+queryData['name']+"','"+queryData['gsm_token']+"','"+queryData['gsm_token2']+"', '"+queryData['mobile_id']+"',' ', '"+queryData['email']+"')",function(error,results,fields){
     connection.query(" UPDATE users SET email = '"+queryData['email']+"', address = '"+queryData['address']+"', id_number = '"+queryData['id_number']+"' WHERE id="+queryData['id']+" ",function(error,results,fields){
      if(!error){
         res.json(true);
      }else{
         res.json(false);
      }
     } );

   
    
 });
router.post('/signin', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
       if(queryData['name']!=null && queryData['mobile_id']!=null&& queryData['gsm_token']!=null){  
        //var token = String.raw(queryData['gsm_token'])
        // console.log(queryData['gsm_token'])
 connection.query("INSERT INTO users (`name`, `gsm_token`, `gsm_token2`,`mobile_id`,`fav`,`email`,`address`,`id_number`,`my_auction`,`auctions` ,`balance` ) VALUES ('"+queryData['name']+"','"+queryData['gsm_token']+"','"+queryData['gsm_token2']+"', '"+queryData['mobile_id']+"',' ', '"+queryData['email']+"', '"+queryData['address']+"' , '"+queryData['id_number']+"' , ' ',' ','0')",function(error,results,fields){
   console.log(error)
  //    connection.query("SELECT  LAST_INSERT_ID() FROM users AS num",async function(error,results,fields){
   
      connection.query("SELECT id FROM users ORDER BY id DESC  ",async function(error,results,fields){
   console.log(results)
        console.log(JSON.parse(JSON.stringify(results))[0]['id'])
        res.json(JSON.parse(JSON.stringify(results))[0]['id'])
      });
 });
      } 
    
 });
router.get('/serach_tag', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query( "SELECT  *  FROM serach WHERE id="+queryData['id']+" " ,function(error,results,fields){
      console.log(results);
       res.json(results);
  });
   });
router.get('/fav', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query( "SELECT  `fav` FROM users WHERE id="+queryData['id']+" " ,function(error,results,fields){
      console.log(results);
       res.json(results);
  });
   });
router.post('/fav', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
 connection.query("UPDATE users SET fav = CONCAT('"+queryData['fav']+"',fav) WHERE id="+queryData['id']+" ",function(error,results,fields){
   console.log(error);
    res.json(results);                              
 });
    });
router.post('/fav_delet', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
 connection.query("UPDATE users SET fav = '"+queryData['fav']+"' WHERE id="+queryData['id']+" ",function(error,results,fields){
   console.log(error);
    res.json(results);                              
 });
    });
router.get('/get_data', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
 connection.query("SELECT name , created_at , status,price,sub FROM "+queryData['type']+"  WHERE id="+queryData['id']+" ",function(error,results,fields){
   console.log(error);
    res.json(results);                              
 });
    });
router.get('/get_data_wait', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
 connection.query("SELECT name , created_at , status FROM wait  WHERE id="+queryData['id']+" ",function(error,results,fields){
   console.log(error);
    res.json(results);                              
 });
    });
router.get('/auctions', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query( "SELECT  `auctions` FROM users WHERE id="+queryData['id']+" " ,function(error,results,fields){
      console.log(results);
       res.json(results);
  });
   });router.post('/auctions', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
 connection.query("UPDATE users SET auctions = CONCAT('"+queryData['auctions']+"',auctions) WHERE id="+queryData['id']+" ",function(error,results,fields){
   console.log(error);
    res.json(results);                              
 });
    });
router.post('/auctions_delet', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
 connection.query("UPDATE users SET auctions = '"+queryData['auctions']+"' WHERE id="+queryData['id']+" ",function(error,results,fields){
   console.log(error);
    res.json(results);                              
 });
    });
router.get('/my_auction', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query( "SELECT  `my_auction` FROM users WHERE id="+queryData['id']+" " ,function(error,results,fields){
      console.log(results);
       res.json(results);
  });
});

//شو هية
//وين  راحت
module.exports = router;
// connection.query("INSERT INTO `users`(`id`, `name`, `email`, `mobile_id`, `address`, `Identification-num`, `password`, `gsm_token`, `remember_token`,
//`created_at`, `updated_at` ,`fav`) VALUES ("+queryData['id']+","+queryData['name']+","+queryData['email']+","+queryData['mobile_id']+", "+queryData['address']+","+queryData['Identification-num']+","+queryData['password']+",
//"+queryData['gsm_token']+", "+queryData['remember_token']+","+queryData['created_at']+","+queryData['updated_at']+" , "+queryData['fav']+")",function(error,results,fields){
