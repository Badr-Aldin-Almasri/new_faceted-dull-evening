var express = require('express');
var router = express.Router();
var url=require('url');
var mysql=require('mysql');
const XLSX = require('xlsx');

var connection = mysql.createPool({
    connectionLimit : 10,
host:'localhost',
user :'admin_default',
password:'aaaaaaa',
database:'admin_default'
});
//connection.connect();
router.get('/' ,async function(req ,res , next){
   const workBook = XLSX.utils.book_new();
   await connection.query( "SELECT * FROM users " , async function(error,results,fields){
   const workSheet = XLSX.utils.json_to_sheet(results);
  XLSX.utils.book_append_sheet(workBook, workSheet, "user")
  });
 
   await   connection.query( "SELECT * FROM complains " ,async function(error,results,fields){
   const workSheet = XLSX.utils.json_to_sheet(results);
   XLSX.utils.book_append_sheet(workBook, workSheet, "complains")
  });

   await   connection.query( "SELECT * FROM faq " ,async function(error,results,fields){
   const workSheet = XLSX.utils.json_to_sheet(results);
   XLSX.utils.book_append_sheet(workBook, workSheet, "faq")
  });

   await   connection.query( "SELECT * FROM social  " ,async function(error,results,fields){
   const workSheet = XLSX.utils.json_to_sheet(results);
   XLSX.utils.book_append_sheet(workBook, workSheet, "social ")
   });
  
   await    connection.query( "SELECT * FROM  term " ,async function(error,results,fields){
   const workSheet = XLSX.utils.json_to_sheet(results);
   XLSX.utils.book_append_sheet(workBook, workSheet, "term")
   });
  
   await connection.query( "SELECT * FROM dashboard" , async function(error,results,fields){
   const workSheet = XLSX.utils.json_to_sheet(results);
   XLSX.utils.book_append_sheet(workBook, workSheet, "dashboard")
   });
  
   await connection.query( "SELECT * FROM wait" , async function(error,results,fields){
   const workSheet = XLSX.utils.json_to_sheet(results);
   XLSX.utils.book_append_sheet(workBook, workSheet, "wait")
 
      });
   await connection.query( "SELECT * FROM  mains " , async function(error,results,fields){
   const workSheet = XLSX.utils.json_to_sheet(results);
   XLSX.utils.book_append_sheet(workBook, workSheet, " mains ")
   var scss_item=0;
   for  (var i=0 ; i<results.length ; i++){
   var a = JSON.parse(JSON.stringify(results[i]));
   var type =a.type ; 
   await connection.query( "SELECT * FROM "+ type +" " , async function(error,resultsa,fields){
   var ss = JSON.parse(JSON.stringify(fields[0]));
   const workSheet = XLSX.utils.json_to_sheet(resultsa);
   XLSX.utils.book_append_sheet(workBook, workSheet, ss.table)
   scss_item++;
   if(results.length==scss_item){
   XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })
   XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
   XLSX.writeFile(workBook, "./public/file/auctionData.xlsx")
   res.send("http://31.220.50.200:3000/file/auctionData.xlsx")
     }
     });
     }
     });
     });




module.exports = router;
