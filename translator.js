angular.module('app', [])
   .controller('mainCtrl', function($scope) {
       $scope.translation = "";
       $scope.translate = function (input) {
	   $scope.translation=translate(input.text);
       };
});

translate=function(text){
    return text;
}
