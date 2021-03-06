const { response } = require('express');
const express = require('express');
const _ld = require('lodash');
const app = express();
const portServer = 11111;

const fxWrite = require('./modules/functions.js');
const fs = require('fs');

const delayData = 10000;

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.get('/',(req,res)=>{
    res.send('[xJoez] : Arduino Term Project');
});

app.get('/data_last/group/:Whatgroup',(req,res)=>{
    let group_ = req.params.Whatgroup;
    let rawdata = fs.readFileSync("./logs/"+group_+"/logs_arduino.json");
    let respJSON = JSON.parse(rawdata);
    // res.json(respJSON);
    let dataSorted = _ld.orderBy(respJSON,['id'],['desc']);
    res.json(dataSorted);
});

app.get('/data/group/:whatGroup',(req,res)=>{
    let group_ = req.params.whatGroup;
    let rawdata = fs.readFileSync("./logs/"+group_+"/logs_arduino.json");
    let respJSON = JSON.parse(rawdata);
    res.json(respJSON);
});

app.get('/data_now/group/:Whatgroup',(req,res)=>{
    let group_ = req.params.Whatgroup;
    fs.readFile("./logs/"+group_+"/logs_arduino.json",'utf8',function readF(err,data){
        if (err) {
            logsToCMD("Fs","Found some error in now readfile function",'error');
        } else {
            var inFiles = JSON.parse(data);
            res.json(_ld.last(inFiles));
        }
    });
});

app.get('/add/:group/:thermoc/:thermof/:thermin/:thermip/:ldr/:led/:room',(req,res)=>{
    let _group = req.params.group;
    let _thermoc = req.params.thermoc;
    let _thermof = req.params.thermof;
    let _thermin = req.params.thermin;
    let _thermip = req.params.thermip;
    let _ldr = req.params.ldr;
    let _led = req.params.led;
    let _room = req.params.room;

    fxWrite.addLogs(_group,_thermoc,_thermof,_thermin,_thermip,_ldr,_led,_room);
    fxWrite.logsToCMD('Arduino',`Webserver receive data from arduino ESP8266 added logs to group ${_group}`,'success');
    res.status(200).send("success");
});

app.listen(portServer,()=>{
    fxWrite.logsToCMD('Webserver',`Webserver is running on port ${portServer}`,'success');
});

function dataTester(){
    setInterval(() => {
        let date_ob = new Date();
        fxWrite.addLogs(date_ob);
    },delayData);
};