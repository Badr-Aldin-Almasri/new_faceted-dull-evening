var express = require('express');
var router = express.Router();
var url=require('url');
var admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const OneSignal = require('@onesignal/node-onesignal');

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
  router.get('/',async function(req, res, next) {
var queryData=url.parse(req.url,true).query;
connection.query("SELECT `gsm_token`,`email`  FROM users WHERE id="+queryData['id']+"",async function(error,results,fields){
  console.log("fcm",results)
  if(results != "" &&results != " "&&results != "[]" &&results != undefined&&results != null) {
    var json_data = JSON.parse(JSON.stringify(results))[0]
    var t = json_data['gsm_token'];
    console.log(json_data["email"])
    console.log(queryData["body"])
    let transporter = nodemailer.createTransport({
    host: "smtp.saudisauctions.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "help@saudisauctions.com", // generated ethereal user
      pass: "aaaaaa", // generated ethereal password
    },
      tls: {
          rejectUnauthorized: false
      }
  });


  let info = await transporter.sendMail({
    from: '"أوكشن السعودية" <help@saudisauctions.com>', // sender address
    to: json_data["email"], // list of receivers
    subject: "أوكشن السعودية", // Subject line
    text:queryData["body"], // plain text body
   // html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));


  const message = {
     'android': {
      "notification": {
        "title":  "أوكشن السعودية",
        "body": queryData["body"],
        "sound": "mysound",
        "tag": "alerts",
        "priority": "high",
        "icon": "myicon",
        "channelId": "high_importance_channel",
      }}, 
  token: t
};
const user_key_provider = {
    getToken() {
        return  "OGY3ZWFiOGItMDc4MC00OGU2LThhM2ItM2ZjNjZhNDFlZDc1";
    }
};
const app_key_provider = {
    getToken() {
        return "MzIwODY4MjAtYmIyYS00NjdmLTk3OWYtYzEyZTg4YmMxMmEx";
    }
};
let configuration = OneSignal.createConfiguration({
    authMethods: {
        user_key: {
            tokenProvider: user_key_provider
        },
        app_key: {
            tokenProvider: app_key_provider
        }
    }
});

var client = new OneSignal.DefaultApi(configuration); 

var app =await client.getApp('a90fef1a-6041-437f-b750-ca6d33417318');

const notification = new OneSignal.Notification();
notification.app_id = app.id;

notification.contents = {
  en: queryData["body"],
ar:queryData["body"]
}
console.log(queryData["body"])
// required for Huawei
notification.headings = {
  en: "أوكشن السعودية",
ar:"أوكشن السعودية",
}
notification.include_external_user_ids=[t]
await client.createNotification(notification);
res.send("yse")
//admin.messaging().send(message)
//  .then((response) => {
//   res.json("yes")
//    console.log('Successfully sent message:', response);
//  })
//  .catch((error) => {
//      res.json(error)
//   console.log('Error sending message:', error);
//  });
//  }
//  });
    }
});
});


module.exports = router;
  
