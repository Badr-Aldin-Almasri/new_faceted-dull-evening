var express = require('express');
var router = express.Router();
var url=require('url');
var app = express();
const schedule = require('node-schedule');
const { NOTFOUND } = require('dns');
const { json } = require('express');
const { name } = require('ejs');
var axios = require('axios');
const date = require('date-and-time');



// -------------------- mysql -----------------------
var mysql=require('mysql');
var connection = mysql.createPool({
    connectionLimit : 10,
host:'localhost',
user :'admin_default',
password:'aaaaaaa',
database:'admin_default'
});
//connection.connect();

var h ="";
var agenda = require('../routes/agenda.js');

router.post('/', function(req, res, next) {
  var queryData=url.parse(req.url,true).query; 
 if(queryData['type']!=null && queryData['created_at']!=null&& queryData['price']!=null&& queryData['name'] !=null && queryData['user_id']!=null && queryData['end_in'] !=null){  
connection.query("INSERT INTO wait( `created_at`,  `photo`, `photos`, `is_hide`, `num_add` , `min_price`,`price`, `name`,  `kind`, `des`, `text_slot_1`, `text_slot_2`, `text_slot_3`, `file_slot_1`, `file_slot_2`, `file_slot_3`, `location`,  `user_id`, `type`, `status`,  `city`,  `end_in`,`sub`,`log`,`main_data`,`view`) VALUES ('"+queryData['created_at']+"','"+queryData['photo']+"','"+queryData['photos']+"','"+queryData['is_hide']+"','"+queryData['num_add']+"','"+queryData['min_price']+"','"+queryData['price']+"','"+queryData['name']+"','"+queryData['kind']+"','"+queryData['des']+"','"+queryData['text_slot_1']+"','"+queryData['text_slot_2']+"','"+queryData['text_slot_3']+"','"+queryData['file_slot_1']+"','"+queryData['file_slot_2']+"','"+queryData['file_slot_3']+"','"+queryData['location']+"','"+queryData['user_id']+"','"+queryData['type']+"','"+queryData['status']+"','"+queryData['city']+"','"+queryData['end_in']+"',' ' ,' ','"+queryData['main_data']+"','"+queryData['view']+"')",
    function(error,results,fields){
   if(error){
  console.log(error);
      res.json("no");
     }else{
      // connection.query("SELECT  LAST_INSERT_ID()  FROM wait ",async function(error,results,fields){
           connection.query("SELECT  id  FROM wait ORDER BY id DESC  ",async function(error,results,fields){   
   console.log(results);
       connection.query("UPDATE  users SET my_auction= CONCAT('"+",0"+"|"+JSON.parse(JSON.stringify(results))[0]['id']+"|"+queryData['type']+"',my_auction) WHERE id='"+queryData['user_id']+"'",async function(error,results,fields){
         console.log(error)
         
         res.json("yes");
       });
       });
 
        
       }
       });
     }else {
    res.json("Enter empty data");
 }
});


router.post('/confirm', function(req,res,next){
  var queryData=url.parse(req.url,true).query;                                         
  connection.query(" INSERT INTO "+queryData['type']+" (created_at,  photo, photos,is_hide, num_add, min_price,price, name,  kind, des, text_slot_1, text_slot_2, text_slot_3, file_slot_1, file_slot_2, file_slot_3, location, user_id,  status,  city , end_in,sub,log,main_data,view) SELECT created_at,  photo, photos,is_hide, num_add, min_price,price, name,  kind, des, text_slot_1, text_slot_2, text_slot_3, file_slot_1,file_slot_2, file_slot_3, location, user_id,  status, city ,end_in ,sub ,log,main_data,view FROM wait WHERE id='"+queryData['id']+"'",function(error,results,fields){
   if(error){ //لاء عملي امر جديد 
    console.log(error)
     } else {         
      connection.query("DELETE FROM wait WHERE id='"+queryData['id']+"'",async function(error,results,fields){
       connection.query("SELECT user_id ,  id ,end_in  FROM "+queryData['type']+"  ORDER BY id DESC ",async function(error,results,fields){
      console.log(results)
      console.log(error)
         var aa= JSON.parse(JSON.stringify(results))[0];
          console.log(aa['end_in']+" minutes")
    var agenda_res =  await  agenda.schedule(aa['end_in']+" hours ", "delete",{id: aa['id'],type:queryData['type']}); 
      console.log(agenda_res)
      console.log(agenda_res.attrs._id);
            
     var dates = aa['end_in'] 
  //var sa_time = date.addHours(new Date(), 0);
 
 // var time = date.addDays(new Date(), parseInt(aa['end_in'])); 
//  const time = date.addMinutes(new Date(), dates);
const time = date.addHours(new Date(), dates);
  var stamp =  date.format(time, 'YYYY-MM-DD HH:mm:ss');   
  connection.query(" UPDATE  "+queryData['type']+" SET created_at='"+stamp+"' , status ='0'  WHERE id= '"+aa['id']+"'",function(error,lresults,fields){
 // console.log(lresults)                        
  console.log(error)                        
});      
     connection.query("SELECT my_auction  FROM users  WHERE id='"+aa['user_id']+"'",  function(error,resultes,fields){
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
          if(queryData['type']==myauction[2].replace(/\s/g, '')  && queryData['id']==myauction[1].replace(/\s/g, '') &&myauction[0] == "3" ){
       //   m.slice(1+i);
         console.log("deleted")
       } else{
         all_m = all_m +","+ m[i]
       }
        }
       
      }
       console.log(all_m);
      //  m.add(",1|"+aa['LAST_INSERT_ID()']+"|"+ queryData['type']) 
       all_m = all_m + ",1|"+aa['id']+"|"+ queryData['type'];
       console.log(all_m);
        connection.query("UPDATE  users SET my_auction= '"+all_m+"' WHERE id='"+aa['user_id']+"'", function(error,results,fields){
       console.log(results);
     });
     });
    connection.query("UPDATE apporoval SET status_of_transform = '2' WHERE id='"+queryData['transform_id']+"'",function(error,results,fields){
});      
         axios.get('http://localhost:3000/fcm', {
    params: {
      id : aa['user_id'] ,
      body :`تمت الموافقة على مزادك
يمكنك مشاهدته على
https://mobile.saudisauctions.com/?type=`+queryData['type']+`&id=`+aa['id']
    }
  })
  .then(function (response) {
   res.json("Perfect");
          });            
       });
     }); 
     }
  });     
});





router.post('/reject_dash', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
  //1
    //1
           connection.query("INSERT INTO archive (created_at,  photo, photos, is_hide,num_add, min_price,price, name,  kind, des, text_slot_1, text_slot_2, text_slot_3, file_slot_1, file_slot_2, file_slot_3, location, user_id,  status,  city , end_in,sub,log,main_data,view) SELECT created_at,  photo, photos,is_hide, num_add, min_price,price, name,  kind, des, text_slot_1, text_slot_2, text_slot_3, file_slot_1,file_slot_2, file_slot_3, location, user_id,  status, city ,end_in ,sub ,log,main_data,view FROM wait WHERE id='"+queryData['id']+"'",function(error,resultsad,fields){ 
    connection.query("DELETE FROM wait WHERE id='"+queryData['id']+"'",async function(error,resultsa,fields){
    var id_in_wait=0;
     connection.query("SELECT my_auction  FROM users  WHERE id='"+queryData['user_id']+"'",  function(error,resultes,fields){
              connection.query("SELECT  id  FROM archive ORDER BY id DESC",async function(error,id_results,fields){
 var auction= JSON.parse(JSON.stringify(resultes[0]['my_auction'])); 
 var new_id= JSON.parse(JSON.stringify(id_results[0]['id'])); 
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
          if(queryData['type']==myauction[2].replace(/\s/g, '')  && queryData['id']==myauction[1].replace(/\s/g, '') &&myauction[0] == "0" ){
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
       all_m = all_m + ",8|"+new_id+"|"+"archive";
       console.log(all_m);
        connection.query("UPDATE  users SET my_auction= '"+all_m+"' WHERE id='"+queryData['user_id']+"'", function(error,results,fields){
       console.log(results);
         res.json("yes") 
    });
    });
    });
     });
     }); 
             try{
                 axios.get('http://localhost:3000/fcm', {
      params: {
      id :  queryData['user_id'] ,
      body : "تم رفض مزادك"
    
    }}).then(function (response) {
          })
             }
             catch(e){}
      });




router.post('/accept', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
  //1
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
          if(queryData['type']==myauction[2].replace(/\s/g, '')  && queryData['id']==myauction[1].replace(/\s/g, '') &&myauction[0] == "0" ){
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
       all_m = all_m + ",2|"+id_in_wait+"|"+ queryData['type'];
       console.log(all_m);
        connection.query("UPDATE  users SET my_auction= '"+all_m+"' WHERE id='"+queryData['user_id']+"'", function(error,results,fields){
       console.log(results);
 
  connection.query(" UPDATE  wait SET status ='1' WHERE id= '"+queryData['id']+"'",function(error,lresults,fields){
   res.json("yes")              
            });    });
     }); 
   
   axios.get('http://localhost:3000/fcm', {
      params: {
      id :  queryData['user_id'] ,
      body : "تمت الموافقة على مزادك يرجى دفع الرسوم"
    
    }}).then(function (response) {
   
          })
   //مافي ; ب nodejs
  
  
  
//   //2
  // connection.query("UPDATE SELECT * FROM apporoval SET status_of_transform = '1' WHERE id='"+queryData['transform_id']+"'",function(error,results,fields){
  //           res.send("yes");
  //         });
 
  
    });


router.post('/answer', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
  console.log(queryData['answer'])
  if(queryData['answer'].toString()=="yes"){
    console.log(queryData['answer'])
  var id_in_wait=0;
 connection.query('UPDATE '+queryData['type']+' SET status ="3" where id="'+queryData['id']+'"',function(error,results,fields){   })
    connection.query('SELECT * FROM '+queryData['type']+' where id="'+queryData['id']+'"',function(error,sresults,fields){                                                              
       var json_data = JSON.parse(JSON.stringify(sresults))
    var t = JSON.parse(JSON.stringify(sresults))[0]['sub']
     var json_data = JSON.parse(JSON.stringify(sresults))
     t = t.split(",")
     var m=t[0].split("|")[0].substring(1)
      console.log(t);    
   res.json("yes")   
   console.log(m);
      axios.get('http://localhost:3000/fcm', {
      params: {
    id : t[0].split("|")[0].substring(1)  ,//تمام 
      body : "لقد فزت بالمزاد يرجى إكمال الخطوات"
    
    }}).then(function (response) {
   
          })
  });
  }
  else{
     res.send("ok")
   }
    });


router.post('/reject', async function(req, res, next) {
var queryData=url.parse(req.url,true).query;
    var id_in_wait=0;
    connection.query('SELECT * FROM '+queryData['type']+' where id="'+queryData['id']+'"',async function(error,sresults,fields){                                                         
    var json_data = JSON.parse(JSON.stringify(sresults))
    var t = JSON.parse(JSON.stringify(sresults))[0]['sub']
    var json_data = JSON.parse(JSON.stringify(sresults))
    t = t.split(",")
    var m=t[0].split("|")[0].substring(1)
    connection.query(" INSERT INTO archive (created_at,  photo, photos,is_hide, num_add, min_price,price, name,  kind, des, text_slot_1, text_slot_2, text_slot_3, file_slot_1, file_slot_2, file_slot_3, location, user_id,  status,  city , end_in,sub,log,main_data,view) SELECT created_at,  photo, photos,is_hide, num_add, min_price,price, name,  kind, des, text_slot_1, text_slot_2, text_slot_3, file_slot_1,file_slot_2, file_slot_3, location, user_id,  status, city ,end_in ,sub ,log,main_data,view FROM "+queryData['type']+" WHERE id='"+queryData['id']+"'",function(error,results,fields){ 
    connection.query("DELETE FROM "+queryData['type']+" WHERE id='"+queryData['id']+"'",async function(error,results,fields){
      res.send("yes")    
    });
    });
      await axios.get('http://localhost:3000/fcm', {
    params: {
      id : t[0].split("|")[0].substring(1),  
      body : "لقد تم رفض السعر من قبل صاحب المزاد"
    }})
  });
    });


router.post('/end_auction', async function(req, res, next){
  var queryData=url.parse(req.url,true).query;
 connection.query("SELECT my_auction  FROM users  WHERE id='"+queryData['user_id']+"'",  function(error,resultes,fields){
 var auction= JSON.parse(JSON.stringify(resultes[0]['my_auction'])); 
       //console.log(auction) 
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
          if('archive'==myauction[2].replace(/\s/g, '')  && queryData['id']==myauction[1].replace(/\s/g, '') ){
       //   m.slice(1+i);
         console.log("deleted")
       } else{
         all_m = all_m +","+ m[i]
       }
        }
       
      }
       console.log(all_m);
     //  all_m = all_m + ",1|"+queryData['id']+"|"+ queryData['type'];
        connection.query("UPDATE  users SET my_auction= '"+all_m+"' WHERE id='"+queryData['user_id']+"'", function(error,results,fields){
       console.log(results);
          
          connection.query("SELECT auctions  FROM users  WHERE id='"+queryData['win']+"'",  function(error,resultes,fields){
 var auction= JSON.parse(JSON.stringify(resultes[0]['auctions'])); 
       //console.log(auction) 
       var all_m = "" ;
        var m = auction.split(",");
       console.log(m)
       if(m[0]=""){
          m.slice(1);
       }
      for(var i=0 ; i < m.length ; i++ ){
        var myauction = m[i].split("|");
        //queryData
        if(myauction[1]){
          if('archive'==myauction[1].replace(/\s/g, '')  && queryData['id']==myauction[0].replace(/\s/g, '')){
       //   m.slice(1+i);
         console.log("deleted")
       } else{
         all_m = all_m +","+ m[i]
       }
        }
       
      }
       console.log(all_m);
     //  all_m = all_m + ",1|"+queryData['id']+"|"+ queryData['type'];
        connection.query("UPDATE  users SET auctions= '"+all_m+"' WHERE id='"+queryData['win']+"'", function(error,results,fields){
connection.query("UPDATE archive SET status= '8' WHERE id='"+queryData['id']+"'", function(error,results,fields){}) 
      console.log(results);
          res.send("ok")
     });
     });
     });
     });
});


module.exports = router;



