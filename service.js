var express = require('express');
var app = express();
app.listen(8080);
messages=["message 1", "message 2","message 3","message 4", "message 5"];

app.get('/messages', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(messages));
});

app.post('/messages', function(req, res){
    res.send('Hello World');
});

