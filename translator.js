angular.module('app', [])
.config(function($httpProvider) {
    $httpProvider.defaults.transformRequest = function(data) {        
        if (data === undefined) { return data; } 
        return $.param(data);
    };
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'; 
}).controller('mainCtrl', ['$scope','$http',function($scope,$http) {



    
	console.log("Angular initialized!");
	$scope.messages = ["Error in retrieving messages"];
	update_messages($scope, $http);
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
    }]);
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
new_message=function($scope, $http, text){
    if($scope.messages.length>=5) $scope.messages.shift();
    if(!contains($scope.messages,text)) $scope.messages.push(text);
    // It turns out that there is a problem with angular's http poster so we'll use ajax.
    $.ajax({
	dataType: undefined,
	type: "POST",
	url : "http://ec2-35-161-98-124.us-west-2.compute.amazonaws.com:8080/messages",
	port: 8080,
	data: {
	    message: text
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
        if (array[i] === object)
            return true;
    return false;
};
