var express = require('express');
var router = express.Router();
var url=require('url');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRouter = require('./routes/main');
var main_dataRouter = require('./routes/main_data');
var fcmRouter = require('./routes/fcm');
var dashRouter = require('./routes/dash');
var accountRouter = require('./routes/account');
var terms_and_conditionsRouter = require('./routes/terms_and_conditions');
var faqRouter = require('./routes/faq');
var socialRouter = require('./routes/social');
var app = express();
const schedule = require('node-schedule');
const date = require('date-and-time');
var agenda = require('./routes/agenda');
var upladeRouter = require('./routes/uplade');
var complaintsRouter = require('./routes/complaints');
var dataxlsxRouter = require('./routes/dataxlsx');
var payRouter = require('./routes/pay');
var approvalRouter = require('./routes/approval');
var https = require('https');
var fs = require('fs');
const options = {
  key: fs.readFileSync(__dirname +"/c.key"),
  cert: fs.readFileSync(__dirname +"/c.crt"),
};
var server = app.listen((3000),()=>{
  console.log("work in 3200");
  
});
//http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
//var server =https.createServer(options, (req, res) => {
//  res.writeHead(200);
//  res.end(`hello world\n`);
//}).listen(3000);
const { NOTFOUND } = require('dns');
const { json } = require('express');
const { name } = require('ejs');
var axios = require('axios');
var io = require("socket.io")(server);
const bodyParser = require('body-parser');


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

// -------------------- mongodb and agenda -----------------------
   
process.env.TZ = "Asia/Riyadh";



app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.header("Access-Control-Allow-Credentials", "true");
res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, access-control-allow-origin,Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});





// -------------------- socket io -----------------------
io.on("connection",(socket)=>{
  console.log("connect");
socket.on("get_all",(All)=>{
    var json_data = JSON.parse(JSON.stringify(All));
    connection.query('SELECT name,view,id,is_hide,created_at,num_add,price,kind,photo,sub,city,status FROM '+json_data['type']+'   ORDER BY created_at ASC;',function(error,results,fields){
    console.log(error);
    if(!error){
    socket.emit('res_all',{data:JSON.stringify(results),type:json_data['type'],kind:json_data['kind']});
    }else{
      socket.emit('res_all', "NOTFOUND");
        };  
    });
});
  
  
socket.on("get_one",(data)=>{
  var json_data = JSON.parse(JSON.stringify(data));
  connection.query('SELECT * FROM '+json_data['type']+' where id="'+json_data['id']+'"',function(error,results,fields){
console.log(error);
console.log(results);
if(!error){
  socket.emit('res_one',{data:JSON.stringify(results),type:json_data.type});
}else{
  socket.emit('res_one',  "NOTFOUND");
}
});
});

  
  var a;
  var b;
 socket.on("update", (data)=> {
  var json_data = JSON.parse(JSON.stringify(data));
   connection.query('SELECT sub ,created_at FROM '+json_data['type']+' where id="'+json_data['id']+'"',function(error,resultds,fields){
if(!error){
var created_at = JSON.parse(JSON.stringify(resultds[0]['created_at'])); 
const now = new Date();
const created_time = new Date(created_at); 
//var time = date.subtract( created_time, now).toHours(); 
  var timemin =date.subtract( created_time,now).toMinutes(); 
 console.log(now)
  console.log(created_time)
// console.log(time)  
  console.log(timemin)//يلا ساوي if
  if (timemin<5 ){
const two_minutes_later = date.addMinutes(new Date(created_time) , 5);
    console.log(two_minutes_later )
     var stamp =  date.format(two_minutes_later, 'YYYY-MM-DD HH:mm:ss');
     connection.query('UPDATE '+json_data['type']+' SET  created_at="'+stamp+'" Where id="'+json_data['id']+'"' ,function(error,results,fields){});
  
  }
  
 var sub = JSON.parse(JSON.stringify(resultds[0]['sub'])); 
 
  if(sub !=null){
     sub = sub.split(",")
  //var s=a[0].split("|")[0].substring(1)
  }else{
    sub=[]
  //var  s=null;
  }
  sub = sub.filter(item => !(item.includes("-"+json_data['name']+"|") ));
  sub.unshift("-"+json_data['name']+"|"+json_data['sub_price'])
  function compareNumbers(a, b) {
  return parseInt(b.split("|")[1]) - parseInt(a.split("|")[1]);
}

sub.sort(compareNumbers);
  console.log(sub)
var last_price = sub[0].split("|")[1];
 // console.log(a)

 connection.query('UPDATE '+json_data['type']+' SET  log=CONCAT("-'+json_data['name']+'|'+json_data['sub_price']+'",log), num_add= num_add + 1  ,price='+last_price+',sub="'+sub+'"  Where id="'+json_data['id']+'"' ,function(error,results,fields){
console.log(error); 
  
if(!error){ 
  connection.query('SELECT name,view,id,is_hide,created_at,num_add,price,kind,photo,sub,status FROM '+json_data['type']+' ORDER BY created_at ASC;',function(error,aresults,fields){
     socket.broadcast.emit('res_all',{data:JSON.stringify(aresults),type:json_data['type'],kind:json_data['kind']});
     socket.emit('res_all',{data:JSON.stringify(aresults),type:json_data['type'],kind:json_data['kind']});
    });
    connection.query('SELECT * FROM '+json_data['type']+' where id="'+json_data['id']+'"',async function(error,sresults,fields){ 
                                                                          
     socket.broadcast.emit('res_one',{data:JSON.stringify(sresults),type:json_data.type});
       socket.emit('res_one',{data:JSON.stringify(sresults),type:json_data.type});
	if (timemin<5 ){
    const job = await agenda.jobs({name: 'delete'});
  job.forEach(element => {
    if(element.attrs.data.id == json_data['id'] && element.attrs.data.type ==json_data['type']){
       console.log(element.attrs.data)
       console.log(element.attrs)
       console.log(element.attrs.nextRunAt)
      element.attrs.nextRunAt = stamp;
       element.save();
    }
 });
}else{
console.log("okkkkk")}
      
  //     axios.get('http://localhost:3000/fcm', {
  //   params: {
  //     id :  s,
  //     body : JSON.parse(JSON.stringify(sresults))[0]['name'] + " لقد زايد شخص اخر على "
  //   }           
  // });      
      
    });

}else{
  socket.emit('res_update ', "NOTFOUND" );
}
});
  }
});
});
});
  
//sub="'+json_data['sub']+'"
//code=CONCAT(code,'-standard')
module.exports = io;


// -------------------- express route -----------------------
app.use('/main', mainRouter);
app.use('/main_data', main_dataRouter);
var post_auctionRouter = require('./routes/post_auction');
app.use('/post_auction', post_auctionRouter);
app.use('/fcm', fcmRouter);
app.use('/account', accountRouter);
app.use('/terms_and_conditions', terms_and_conditionsRouter);
app.use('/faq', faqRouter);
app.use('/dash', dashRouter);
app.use('/social', socialRouter);
//app.use('/', express.static('public_html'))
app.use('/file', express.static('public/file'))
//app.use('/', indexRouter);
app.use('/uplode', upladeRouter);
app.use('/complaint',complaintsRouter);
app.use('/dataxlsx',dataxlsxRouter);
app.use('/approval',approvalRouter);
app.use('/pay',payRouter);
// app.use('/users', usersRouter);
// app.use('/insert', insertRouter);
// app.use('/select', selectRouter);
// app.use('/updatdelet', updatdeletRouter);
