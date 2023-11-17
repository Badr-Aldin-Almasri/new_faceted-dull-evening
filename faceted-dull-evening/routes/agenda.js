
const Agenda = require("agenda");
const axios = require('axios');
var mongoose = require('mongoose');


const uri = "mongodb+srv://auction:jtCaDRMdrhqDqmIa@cluster0.9rqt7x8.mongodb.net/?retryWrites=true&w=majority";
const n_uri = "mongodb://myUserAdmin:abc123@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=20000&authSource=admin&appName=mongosh+1.8.0"
const agenda = new Agenda({ db: { address: n_uri } });   
var mysql=require('mysql');
var connection = mysql.createPool({
    connectionLimit : 10,
host:'localhost',
user :'admin_default',
password:'aaaaaaa',
database:'admin_default'
});
//connection.connect();
agenda.define("delete", async (job) => {
  var io = require("../app.js")
  await console.log("hello");  
       console.log(job.attrs.data);
  console.log(job.attrs.data.type);
       console.log(job.attrs.data.id);
  connection.query('UPDATE '+job.attrs.data.type+' SET status ="2" where id="'+job.attrs.data.id+'"',function(error,results,fields){   
  connection.query('SELECT name,view,id,created_at,is_hide,num_add,price,kind,photo,sub,status FROM '+job.attrs.data.type+' ORDER BY created_at ASC;',function(error,aresults,fields){
     io.emit('res_all',{data:JSON.stringify(aresults) ,type: job.attrs.data.type });
    });
    connection.query('SELECT * FROM '+job.attrs.data.type+' where id="'+job.attrs.data.id+'"',function(error,sresults,fields){                                                              
       io.emit('res_one',{data: "deleted" ,type: job.attrs.data.type });
       var json_data = JSON.parse(JSON.stringify(sresults))
    var t = JSON.parse(JSON.stringify(sresults))[0]['sub']
     var json_data = JSON.parse(JSON.stringify(sresults))
    var user_id = JSON.parse(JSON.stringify(sresults))[0]['user_id']
     t = t.split(",")
 console.log(t)
      console.log(t.length)
      if(t.length>1){   
 var m=t[0].split("|")[0].substring(1)
      console.log(t);    
      console.log(m);
      
        axios.get('http://localhost:3000/fcm', {
    params: {
      id : t[0].split("|")[0].substring(1)  ,//تمام 
      body : JSON.parse(JSON.stringify(sresults))[0]['name'] + " لقد ربحت بمزاد "
          }
          });
      for(var i=1 ; i< t.length; i++){
   console.log(i);
  
        axios.get('http://localhost:3000/fcm', {
    params: {
      id : t[i].split("|")[0].substring(1)  ,
      body : JSON.parse(JSON.stringify(sresults))[0]['name'] + " للأسف انتهى وقت المزاد"
    
    }      
  });
      }
           axios.get('http://localhost:3000/fcm', {
    params: {
      id : user_id ,
      body : JSON.parse(JSON.stringify(sresults))[0]['name'] + " انتهى وقت مزادك"
    
    }    
  });
 }else{
        axios.get('http://localhost:3000/fcm', {
    params: {
      id : user_id ,
      body : JSON.parse(JSON.stringify(sresults))[0]['name'] + " للإسف لم يشارك أحد في"
    
    }    
  }); 
                connection.query("INSERT INTO archive (created_at,  photo, photos,is_hide, num_add, min_price,price, name,  kind, des, text_slot_1, text_slot_2, text_slot_3, file_slot_1, file_slot_2, file_slot_3, location, user_id,  status,  city , end_in,sub,log,main_data,view) SELECT created_at,  photo, photos, is_hide,num_add, min_price,price, name,  kind, des, text_slot_1, text_slot_2, text_slot_3, file_slot_1,file_slot_2, file_slot_3, location, user_id,  status, city ,end_in ,sub ,log,main_data,view FROM "+job.attrs.data.type+" WHERE id='"+job.attrs.data.id+"'",function(error,resultsad,fields){ 
    connection.query("DELETE FROM "+job.attrs.data.type+" WHERE id='"+job.attrs.data.id+"'",async function(error,resultsa,fields){
    var id_in_wait=0;
     connection.query("SELECT my_auction  FROM users  WHERE id='"+user_id+"'",  function(error,resultes,fields){
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
          if(job.attrs.data.type==myauction[2].replace(/\s/g, '')  && job.attrs.data.id==myauction[1].replace(/\s/g, '')  ){
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
       all_m = all_m + ",9|"+new_id+"|"+"archive";
       console.log(all_m);
        connection.query("UPDATE  users SET my_auction= '"+all_m+"' WHERE id='"+user_id+"'", function(error,results,fields){
       console.log(results);
         
    });
    });
    });
     });
     }); 
    } 
  });
  });
  });
(async function () {
console.log(n_uri)
    await agenda.start();
  await mongoose.connect(n_uri+'/agendaJobs');
  console.log(n_uri)
  //await agenda.every("1 minutes", "delete old users");
  // Alternatively, you could also do:
 // await agenda.every("*/1 * * * *", "delete old users");
})();
module.exports = agenda;
