var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(8080);

messages=["message 1", "message 2","message 3","message 4", "message 5"];

app.get('/messages', function(request, response){
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(messages));
});

app.post('/messages', function(request, response){
    if(request.body.message.length >0 && request.body.message.length < 99) new_message(request.body.message);
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(messages));
});

new_message=function(message){
    messages.push(message);
    messages.shift();
};
