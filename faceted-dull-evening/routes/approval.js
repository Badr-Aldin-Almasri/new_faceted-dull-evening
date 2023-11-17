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


 router.post('/pay', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query("INSERT INTO apporoval ( user_id, auction_id,auction_type, id_of_transforms, status_of_transform, amount,pay_type) VALUES ('"+queryData['user_id']+"','"+queryData['auction_id']+"','"+queryData['auction_type']+"','"+queryData['id_of_transforms']+"','0','"+queryData['amount']+"','"+queryData['pay_type']+"') " ,function(error,results,fields){
  //1
if(queryData['pay_type'] == "pay"){
  var id_in_wait=0;
     connection.query("SELECT my_auction  FROM users  WHERE id='"+queryData['user_id']+"'",  function(error,resultes,fields){
 var auction= JSON.parse(JSON.stringify(resultes[0]['my_auction'])); 
       console.log(auction) 
       var all_m = "" ;
        var m = auction.split(",");
       console.log(m)
       if(m[0]=""){  
          m.slice(1);  
       }
         for(var i=0 ; i < m.length ; i++ ){
        var myauction = m[i].split("|");
        //queryData
        if(myauction[2]){
          if(queryData['auction_type']==myauction[2].replace(/\s/g, '')  && queryData['auction_id']==myauction[1].replace(/\s/g, '') &&myauction[0] == "2" ){
            id_in_wait=myauction[1];
       //   m.slice(1+i);      //للكب                  
            //هي شو يعني 
         console.log("deleted")
       } else{
         all_m = all_m +","+ m[i]
       }
        }
       
      }
       console.log(all_m);
      //  m.add(",1|"+aa['LAST_INSERT_ID()']+"|"+ queryData['type']) 
       all_m = all_m + ",3|"+id_in_wait+"|"+ queryData['auction_type'];
       console.log(all_m);
        connection.query("UPDATE  users SET my_auction= '"+all_m+"' WHERE id='"+queryData['user_id']+"'", function(error,results,fields){
       console.log(results);
          res.json("yes") 
     });
     });
}else{
      connection.query("UPDATE  "+queryData['auction_type']+" SET status= '6' WHERE id='"+queryData['auction_id']+"'", function(error,results,fields){
       console.log(results);
          res.json("yes") 
     });
    } 
  });
   });


 router.post('/add', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query("INSERT INTO apporoval ( user_id, auction_id, id_of_transforms, status_of_transform, amount) VALUES ('"+queryData['user_id']+"','"+queryData['auction_id']+"','"+queryData['id_of_transforms']+"','0','"+queryData['amount']+"') " ,function(error,results,fields){
      console.log(results);
       res.json(results);
  });
   });

 router.post('/payment', function(req, res, next) {
var queryData=url.parse(req.url,true).query; 
  connection.query( "SELECT * FROM apporoval  WHERE user_id ='"+queryData['user_id']+"' " ,function(error,results,fields){
      console.log(results);
       res.json(results);
  });
   });


















module.exports = router;
