angular.module('app', [])
    .controller('mainCtrl', function($scope,$http) {
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
	console.log(response);
	$scope.messages=response.data;
    }, function(response){
	console.log(response);
    });
}
new_message=function($scope, $http, message){
    if($scope.messages.length>=5) $scope.messages.shift();
    $scope.messages.push(message);
    $http({
	method : "POST",
	url : "http://ec2-35-161-98-124.us-west-2.compute.amazonaws.com:8080/messages",
	port: 8080,
	body: JSON.stringify(message)
    }).then(function(response) {
	console.log(response);
	$scope.messages=response.data;
    }, function(response){
	console.log(response);
    });
}
