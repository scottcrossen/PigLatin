amount_of_messages=5;
angular.module('app', ['angularModalService'])
.config(function($httpProvider) {
    $httpProvider.defaults.transformRequest = function(data) {        
        if (data === undefined) { return data; } 
        return $.param(data);
    };
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'; 
}).controller('mainCtrl', function($scope,$http,ModalService) {
    console.log("Angular initialized!");
    $scope.messages = [{text:"Error in retrieving messages"}];
    $scope.name={first: "Anonymous", last: "", handle: "Unknown Pig"}
    update_messages($scope, $http);
    $scope.show = function() {
        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "ModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
		if(result != undefined && result.first != undefined && result.first.length > 0){
		    $scope.name.first=capitalize_first(result.first);
		    $scope.name.last=capitalize_first(result.last);
		    $scope.name.handle=find_handle(result.first.toLowerCase());
		}
		else{
		    $scope.name= {
			first: "Anonymous",
			Last:"",
			handle:"Unknown Pig"
		    }
		    $scope.show();
		}
            });
        });
    };
    $scope.show();
    $scope.translate = function (input) {
	console.log("Translate button clicked"); 
	if (input != null && input != undefined){
	    new_message($scope, $http, translate(input.text));
	}
    };
    $scope.refresh = function(){
	console.log("Refresh button clicked");
	update_messages($scope, $http);
    }
}).controller('ModalController', function($scope, close) {
 $scope.close = function(result) {
 	close(result, 500);
 };
});
translate=function(text){
    if (text=="" || text==null || text == undefined) return "";
    english_array=text.replace(/[^\w\s]|_/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g, ' ').split(' ');
    translate_word=function(word){
	switch (word.toLowerCase().search(/[aeiuo]/)){
	    case 0: return word.toLowerCase()+"way"; break;
	    case -1: return word.toLowerCase()+"ay"; break;
	    default: return word.toLowerCase().replace(/([^aeiou]*)([aeiou])(\w*)/, "$2$3$1ay"); break;
	}
    }
    latin_array=[];
    for (i in english_array){
	if(!(/[^\w\s]|_/g.test(english_array[i])) && !(english_array[i]==""))
	    latin_array.push(translate_word(english_array[i]));
	else latin_array.push(english_array[i]);
    }
    return latin_array.join(" ").replace(/\s[^\w\s]|_/g, function($1){return $1.substring(1)});
}
update_messages=function($scope, $http){
    $http({
	method : "GET",
	url : "http://ec2-35-161-98-124.us-west-2.compute.amazonaws.com:8080/messages",
	port: 8080
    }).then(function(response) {
	console.log("Get request suceeded");
        console.log("Get request finished with response:");
	console.log(response.data);
	$scope.messages=response.data;
    }, function(response){
	console.log("Get request failed");
        console.log("Get request finished with response:");
	console.log(response.data);
    });
    return $scope.messages;
}
new_message=function($scope, $http, txt){
    if($scope.messages[0].text == "Error in retrieving messages") $scope.messages.shift();
    if($scope.messages.length>=amount_of_messages) $scope.messages.shift();
    if(!contains($scope.messages, txt)) $scope.messages.push({name: convert_name($scope.name), text: txt});
    // It turns out that there is a problem with angular's http poster so we'll use ajax.
    $.ajax({
	dataType: undefined,
	type: "POST",
	url : "http://ec2-35-161-98-124.us-west-2.compute.amazonaws.com:8080/messages",
	port: 8080,
	data: {
	    name: convert_name($scope.name),
	    text: txt
	},
    }).done(function(response) {
	console.log("Post request suceeded");
	$scope.messages=response;
    }).fail(function(response) {
	console.log("Post request failed")
    }).always(function(response){
	console.log("Post request finished with response:");
	console.log(response);
	update_messages($scope, $http);
});
/*
    $http({
	method : "POST",
	url : "http://ec2-35-161-98-124.us-west-2.compute.amazonaws.com:8080/messages",
	port: 8080,
	data: {
	    message: text
	},
	headers: {
            "Content-Type": undefined
	}
    }).then(function(response) {
	console.log(response);
	$scope.messages=response.data;
    }, function(response){
	console.log(response);
    });*/
    return $scope.messages;
}
contains=function(array, object) {
    for (var i = 0; i < array.length; i++)
        if (array[i].text === object)
            return true;
    return false;
};
find_handle=function(name){
    return pig_names[name.charCodeAt(0)-97];
}
pig_names=[
    "Ace",
    "Babe",
    "Gouger",
    "Snouter",
    "Rooter",
    "Tusker",
    "Gryllus",
    "Hamilton",
    "Henry the Pig",
    "Hercules",
    "Jodie",
    "Little Pig Robinson",
    "Old Major",
    "Olivia",
    "Piglet",
    "Positive Pig",
    "Toby the Lear,ned Pig",
    "The Transcendent Pig",
    "Napoleon",
    "Wilbur",
    "Mandachuva",
    "Leaf-eater",
    "Star-looker",
    "Planter",
    "Snowball",
    "Squealer"
    ]
convert_name=function(name){
    return name.handle+" ("+name.first+" "+name.last+")";
}
function capitalize_first(string) {
    if(string != undefined && string.length >0)
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    else
	return "";
}
