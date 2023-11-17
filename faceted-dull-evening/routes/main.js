var express = require('express');
var router = express.Router();
/* GET home page. */


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
   //var agenda = require('/app/routs/.js');
let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date in YYYY-MM-DD format
console.log(year + "-" + month + "-" + date);

// prints date & time in YYYY-MM-DD HH:MM:SS format
console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

// prints time in HH:MM format
console.log(hours + ":" + minutes);
  console.log("start")
//  const updateJobById = async (jobId, updateBody) => {
// const job = await agenda.jobs({ _id: mongoose.Types.ObjectId("63b5ed202430c52aa11ba770")});
 //    const job = await agenda.jobs({name: 'delete'});
 //  job.forEach(element => {
 //    if(element.attrs.data.id == 46 && element.attrs.data.type =="vehicles"){
 //       console.log(element.attrs.data)
 //      element.attrs.data.type = "hello";
 //       element.save();
 //    }
 // });
  
  
      // Object.assign(job[0].attrs.data, updateBody);
     // await job[0].save();
      //console.log(job)
     //return job;

    
//  };

// agenda.jobs({name: 'delete'}, {data:-1}, 3, 2, (error, jobs) => {
//   console.log(jobs)
//   const job = jobs[0];
//   job.attrs.data.someProperty = 'new value';
//   job.save();
// });
//    console.log("start")
//    agenda.jobs({
//     name: 'run',
//     _id: ObjectID(scheduleId),
// },{ length: -1 },10,10, (error, jobs) => {
//     console.log(jobs)
//     console.log(error)
//   // const job = jobs[0];
//   // job.attrs.data.someProperty = 'new value';
//   // job.save();
// });
  console.log("end")
  connection.query('SELECT * FROM mains',function(error,results,fields){
 if(!error)
    {
      res.json(results);
    }
     });
});
router.get('/version',async function(req, res, next) {
  connection.query('SELECT * FROM version WHERE id = 1',function(error,results,fields){
 if(!error)
    {
      res.json(results[0]);
    }
     });
});
module.exports = router;
