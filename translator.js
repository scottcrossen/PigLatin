angular.module('app', [])
   .controller('mainCtrl', function($scope) {
       $scope.translation = "";
       $scope.translate = function (input) {
	   $scope.translation=translate(input.text);
       };
});
translate=function(text){
    if (text=="" || text==null) return "";
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
