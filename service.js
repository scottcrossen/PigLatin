var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//var path = require('path')
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://ec2-35-161-98-124.us-west-2.compute.amazonaws.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

//app.use(express.static(path.normalize(__dirname + '/')));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(8080);

messages=["message 1", "message 2","message 3","message 4", "message 5"];

app.get('/messages', function(request, response){
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(messages));
});

app.post('/messages', function(request, response){
    if(request.body != undefined && request.body != null && Array.isArray(request.body.message)){
	if(request.body.message.length >0 && request.body.message.length < 99) new_message(request.body.message);
    }
    else console.log(request.body);
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(messages));
});

new_message=function(message){
    messages.push(message);
    messages.shift();
};
