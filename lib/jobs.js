// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

const schedule = require('node-schedule');
const connect = require('./connect');

// const exexampleJob = schedule.scheduleJob('*/3 * * * * *', function(fireDate){
//     console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
//     throw "ccc"
// });
// exexampleJob.on('run', function() {
//     console.log('run') 
// });

// exexampleJob.on('canceled', function() {
//     console.log('canceled') 
// });

// exexampleJob.on('error', function() {
//     console.log('error') 
// });

// exexampleJob.on('success', function() {
//     console.log('success') 
// });


function NewJob(workName, cronString, workerFunction){
    console.log(`start a newjob: ${workName} - ${cronString}`)
    const exexampleJob = schedule.scheduleJob(cronString, workerFunction);
    exexampleJob.on('run', function() {
        connect.send({
            type:'job_status',
            data:`${connect.nowTime()}${workName}[${cronString}] run`
        })
    });

    exexampleJob.on('canceled', function() {
        connect.send({
            type:'job_status',
            data:`${connect.nowTime()}${workName}[${cronString}] canceled`
        })
    });

    exexampleJob.on('error', function() {
        connect.send({
            type:'job_status',
            data:`${connect.nowTime()}${workName}[${cronString}] error`
        })
    });

    exexampleJob.on('success', function() {
        connect.send({
            type:'job_status',
            data:`${connect.nowTime()}${workName}[${cronString}] success`
        })
    });
}



module.exports =  function(){
    
    NewJob("instagram_comments_test_0","1 * * * * *",()=>{
        const fetch_test = require('../fetch/test');
        fetch_test("", "", "").then(r => {
            console.log("ok")
        })
    })

    NewJob("instagram_comments_fetch_1","30 * * * * *",()=>{
        const fetch_test = require('../fetch/test');
        fetch_test("", "", "").then(r => {
            console.log("ok")
        })
    })
}





module.exports()