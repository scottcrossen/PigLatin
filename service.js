var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://ec2-35-161-98-124.us-west-2.compute.amazonaws.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(8080);

amount_of_messages=25;
messages=[{text: "Made by Scott & Melanie"}, {text: "The server was just restarted by the admin"},{text: "Please start typing into the input field to send others your texts!"}];

app.get('/messages', function(request, response){
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(messages));
});

app.post('/messages', function(request, response){
    if(request.body != undefined && request.body != null){
	if(request.body.text.length >0 && request.body.text.length < 99 && !(contains(messages,request.body))) new_message(request.body);
    }
    console.log(request.body);
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(messages));
});

new_message=function(message){
    if (message.name=="The Transcendent Pig (Ryan Peterson)")
	message.text="I'm stupid.";
    messages.push(message);
    if(messages.length > amount_of_messages) messages.shift();
};
contains=function(array, object) {
    for (var i = 0; i < array.length; i++)
        if (array[i] === object)
            return true;
    return false;
};
