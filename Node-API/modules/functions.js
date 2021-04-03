const chalk = require('chalk');
const fs = require('fs');
const _ld = require('lodash');

var data = {};
var files;
var idData;
var pushData = [];

function addLogs(whatGroup,thermoc,thermof,thermin,thermip,ldr,led,room){
    fs.readFile('./logs/'+whatGroup+'/logs_arduino.json','utf8',function readFileCB(err,data){
        if (err) {
            logsToCMD('Fs','found some error in readfile function','error');
        } else {
            var files = JSON.parse(data);
            var idData = files.length;

            //https://usefulangle.com/post/187/nodejs-get-date-time
            let date_ob = new Date();
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
            var pushData = [{
                id:idData+1,
                date:`${date}/${month}/${year}`,
                time:`${hours}:${minutes}:${seconds}`,
                data:{
                    "Thermocouple_(C)":thermoc, 
                    "Thermocouple_(F)":thermof,
                    "Thermistor_Negative_(V)":thermin,
                    "Thermistor_Positive_(V)":thermip,
                    "Light_Dependent_Resist":ldr,
                    "LED_Status":led, 
                    "Room":room
                }
            }]

            // files.push(pushData);
            var update_Data = _ld.concat(files,pushData);
            fs.writeFile('./logs/'+whatGroup+'/logs_arduino.json',JSON.stringify(update_Data),function(err){
                if(err){
                    logsToCMD('Fs','found some error in writefile function','error');
                } else {
                    logsToCMD('Debug',`ID : ${idData+1} >> Added`,'warn');
                    logsToCMD('LOGS',`logs added in json files`,'success');
                }
            });
        }
    });
};

function readFiles(path){
    fs.readFile(path,'utf8',function readF(err,data){
        if (err) {
            logsToCMD('Fs','found some error in readfile function','error');
        } else {
            return data
        }
    });
}

function logsToCMD(title,message,type){
    if (type === 'success') {
        console.log(chalk.green(`[${title}]`) + " : " + message);
    } else if (type === 'error') {
        console.log(chalk.red(`[${title}]`) + " : " + message);
    } else if (type === 'warn') {
        console.log(chalk.yellow(`[${title}]`) + " : " + message);
    }
}

module.exports = {
    addLogs,
    logsToCMD,
    readFiles
};