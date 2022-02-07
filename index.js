'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));
const server = createServer(app);

require('./lib/websocket')(server)


//http request call the fetch scripts and return the json result
app.get("fetch",async (req, res) => {
  try{
    const requestParams = JSON.parse(req.body) ;
    const scriptName = requestParams["script"]
    const params = requestParams['params']
    const script = require(`./fetch/${scriptName}`);
    const result = await script(JSON.parse(params))
    res.json(result)
  }catch(e){
    res.json(e)
  }
})


server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});
