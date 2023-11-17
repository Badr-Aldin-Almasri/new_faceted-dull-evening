var express = require('express');
var router = express.Router();
var url=require('url');
var axios = require('axios');

var mysql=require('mysql');
var connection = mysql.createPool({
    connectionLimit : 10,
host:'localhost',
user :'admin_default',
password:'aaaaaaa',
database:'admin_default'
});
//connection.connect();

router.post('/',async function (req, res, next) {
var queryData=url.parse(req.url,true).query;
connection.query("SELECT price from mains WHERE type='"+queryData['type']+"'",async function(error,results,fields){
connection.query("SELECT * from users WHERE id='"+queryData['user_id']+"'",async function(error,resultsa,fields){
    await  connection.query("SELECT price from "+queryData['type']+" WHERE id='"+queryData['id']+"'",async function(error,raesults,fields){
      console.log(error);
      console.log(resultsa);
  var price;
  if(queryData['pay_type'] == "add")price=queryData['price'];
  if(queryData['pay_type'] == "pay")price=results[0]['price'];
  if (queryData['pay_type'] == "pay2"){
    console.log("here");
    console.log(queryData['discount'])
    if(queryData['discount']=="ok"){
      price = parseInt(raesults[0]['price']-resultsa[0]['balance'])
          console.log(resultsa[0]['balance']);
    console.log(raesults[0]['price']);
    }else{
       price= raesults[0]['price']
    console.log(raesults[0]['price']);
      
    }
  }
      console.log(price);
    await  console.log(await price);
  const body={
//    "profile_id": "96712",
     "profile_id":"104550",
    "tran_type": "sale",
    "tran_class": "ecom",
    "cart_id": "cart_11111",
    "cart_currency":  "SAR",
    "cart_amount":await price,
    "cart_description": queryData['pay_type']+"|"+queryData['user_id']+"|"+queryData['id']+"|"+queryData['type'],
    "paypage_lang": "ar",
    "customer_details": {
        "name": resultsa[0]['name'],
        "email": resultsa[0]['email'],
        "phone": resultsa[0]['mobile_id'],
        "city": resultsa[0]['address'],
        "country": "SA"
    },
    // "shipping_details": {
    //     "name": "name1 last1",
    //     "email": "email1@domain.com",
    //     "phone": "971555555555",
    //     "street1": "street2",
    //     "city": "dubai",
    //     "state": "dubai",
    //     "country": "AE",
    //     "zip": "54321"
    // },
   // "callback": "https://31.220.50.200:3000/pay/cansel",
    "return": "https://saudisauctions.com:3000/pay/check",
 //   "redirect_url": "https://faceted-dull-evening.glitch.me/pay/check",
    "hide_shipping":true
};
  
 if(price >0){ await axios.post('https://secure.paytabs.sa/payment/request', body, { headers: {Authorization:"S6JNDZGBBM-JH2DWLBD26-BL6LT9GWZN"}})
  .then(  (value) => {
    console.log(value.data); 
    console.log(value.data['redirect_url']); 
res.json({"url":value.data['redirect_url'],"tran_ref":value.data['tran_ref']})    
// res.send(value.data['redirect_url'])
  });}else{
   console.log("faild")
 }
  });
    })

  });
});


router.post('/check',async function(req, res, next) {
var queryData=url.parse(req.url,true).query;
  const body={
   // "profile_id":96712 ,
   "profile_id":104550 ,
   // "tran_ref": req.body.tranRef,
  "tran_ref": queryData['tranRef'], 
  
  };
  // console.log(queryData)
  // console.log(req.body)
 console.log( queryData['tranRef']);
  console.log(req.body.tranRef);
 await axios.post('https://secure.paytabs.sa/payment/query', body, { headers: {Authorization:"S6JNDZGBBM-JH2DWLBD26-BL6LT9GWZN"}}).then((value)=>{
   console.log(value.data)
   console.log(value.data.payment_result.response_status == 'A')
   if(value.data.payment_result.response_status == 'A'){
     var des = value.data.cart_description.split("|")
     if(des[0]=="pay"||des[0]=="pay2"){
          axios.post('http://localhost:3000/approval/pay?pay_type='+des[0]+'&&user_id='+des[1]+'&&auction_id='+des[2]+'&&auction_type='+des[3]+'&&id_of_transforms='+queryData["tranRef"]+'&&amount='+value.data.cart_amount).then((values)=>{
            res.send("yes")
       });
     }
     console.log(des[0]=="add")
      if(des[0]=="add"){
  connection.query("INSERT INTO apporoval ( user_id, auction_id,auction_type, id_of_transforms, status_of_transform, amount,pay_type) VALUES ('"+des[1]+"',' ',' ','"+queryData["tranRef"]+"','0','"+value.data.cart_amount+"','"+des[0]+"') " ,function(error,results,fields){
    console.log(results)        
    console.log(error)        
    
    res.send("yes")
       });
     }
    
   }else{
     res.send("no")
   }
 })
});

router.get('/get_wallet', function(req, res, next) {
var queryData=url.parse(req.url,true).query;
  connection.query("SELECT balance from users WHERE id='"+queryData['user_id']+"'",async function(error,resultsa,fields){
    res.json(resultsa)
  });
});


router.post('/check_pay_dash',async function(req, res, next) {
var queryData=url.parse(req.url,true).query;
  const body={
    //"profile_id":96712 ,
    "profile_id":104550 ,
    "tran_ref": queryData['tran_ref'],
    
  };
  // console.log(queryData)
  // console.log(req.body)
 // console.log(req.body.tranRef);
try{
 await axios.post('https://secure.paytabs.sa/payment/query', body, { headers: {Authorization:"S6JNDZGBBM-JH2DWLBD26-BL6LT9GWZN"}}).then((value)=>{
   res.send(value.data)
 })
}
catch(e){
res.send("error")}
})

router.post('/add_wallet',async function(req, res, next) {
var queryData=url.parse(req.url,true).query;
  connection.query("UPDATE users SET balance = balance + '"+queryData['amount']+"'  WHERE id='"+queryData['user_id']+"'",async function(error,resultsa,fields){
    connection.query("UPDATE apporoval SET status_of_transform = '2' WHERE id='"+queryData['tran_id']+"'",function(error,results,fields){
      res.send("yes")
});   
  });
})




router.post('/accept_pay2', async function(req, res, next) {
var queryData=url.parse(req.url,true).query;
    connection.query('SELECT * FROM '+queryData['type']+' where id="'+queryData['id']+'"',async function(error,sresults,fields){                                                         
    var json_data = JSON.parse(JSON.stringify(sresults))
    var t = JSON.parse(JSON.stringify(sresults))[0]['sub']
    var json_data = JSON.parse(JSON.stringify(sresults))
    t = t.split(",")
    var m=t[0].split("|")[0].substring(1)
     connection.query(" INSERT INTO archive (created_at,  photo, photos,is_hide, num_add, min_price,price, name,  kind, des, text_slot_1, text_slot_2, text_slot_3, file_slot_1, file_slot_2, file_slot_3, location, user_id,  status,  city , end_in,sub,log,main_data,view) SELECT created_at,  photo, photos, is_hide ,num_add, min_price,price, name,  kind, des, text_slot_1, text_slot_2, text_slot_3, file_slot_1,file_slot_2, file_slot_3, location, user_id,  status, city ,end_in ,sub ,log,main_data,view FROM "+queryData['type']+" WHERE id='"+queryData['id']+"'",function(error,results,fields){ 

    connection.query("DELETE FROM "+queryData['type']+" WHERE id='"+queryData['id']+"'",async function(error,results,fields){
//      res.send("yes")    
  
     
       var id_in_wait=0;
     connection.query("SELECT my_auction  FROM users  WHERE id='"+JSON.parse(JSON.stringify(sresults))[0]['user_id']+"'",  function(error,resultes,fields){
        connection.query("SELECT id FROM archive ORDER BY id DESC ",async function(error,results,fields){
      console.log(results)
        var new_id = JSON.parse(JSON.stringify(results))[0]['id']
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
          if(queryData['type']==myauction[2].replace(/\s/g, '')  && queryData['id']==myauction[1].replace(/\s/g, '') &&myauction[0] == "1" ){
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
       all_m = all_m + ",4|"+new_id+"|"+ "archive";
       console.log(all_m);
        connection.query("UPDATE  users SET my_auction= '"+all_m+"' WHERE id='"+JSON.parse(JSON.stringify(sresults))[0]['user_id']+"'", function(error,results,fields){
       console.log(results);
     });
          
       var ida_in_wait=0;
     connection.query("SELECT auctions  FROM users  WHERE id='"+t[0].split("|")[0].substring(1)+"'",  function(error,resultes,fields){

       var auction= JSON.parse(JSON.stringify(resultes[0]['auctions'])); 
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
        if(myauction[1]){
          if(queryData['type']==myauction[1].replace(/\s/g, '')  && queryData['id']==myauction[0].replace(/\s/g, '') ){
            ida_in_wait=myauction[0];
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
       all_m = all_m + ","+new_id+"|archive" ;
       console.log(all_m);
        connection.query("UPDATE  users SET auctions= '"+all_m+"' WHERE id='"+t[0].split("|")[0].substring(1)+"'", function(error,results,fields){
       console.log(results);
     });
     });
 connection.query("UPDATE users SET balance = balance + '"+queryData['amount']+"'  WHERE id='"+t[0].split("|")[0].substring(1)+"'",async function(error,resultsa,fields){
            //console.log(resultsa)
                  connection.query("UPDATE archive SET status= '7' WHERE id='"+new_id+"'", function(error,results,fields){})
            console.log(error)
    connection.query("UPDATE apporoval SET status_of_transform = '2' WHERE id='"+queryData['tran_id']+"'",function(error,results,fields){
      res.send("yes")
});   
  });
     }); 
  try{
       axios.get('http://localhost:3000/fcm', {
      params: {
      id :  JSON.parse(JSON.stringify(sresults))[0]['user_id'] ,
      body : "يرجى التحدث مع الدعم الفني لأستلام نقود المزاد"
    
    }})
      axios.get('http://localhost:3000/fcm', {
    params: {
      id : t[0].split("|")[0].substring(1),  
      body : "لقد تم قبول الدفعة يرجى التحدث مع الدعم الفني"
    }})
  }catch(e){}     
});
  });
    });
        });
    });


module.exports = router;














