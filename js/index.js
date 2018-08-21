var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'ngAnimate', 'quiet.directive']);
app.controller('indexCtrl', function($scope, $http, $uibModal, $log) {


	$scope.quiet = {
        images: [],
        files:[]
    }


    var fileInput = document.querySelector("#fileChooser");
    var holder = document.getElementById('holder');
    fileInput.addEventListener("change", function(evt) {
        var files = fileInput.files;
        for (var i = 0; i < files.length; i++) {
        	files[i].objectURL = window.URL.createObjectURL(fileInput.files[i]);
        	$scope.quiet.files.push(files[i]);
        }
        fileInput.setAttribute("type","text");
        $scope.$apply();
        fileInput.setAttribute("type","file");
    }, false);

    $scope.upload = function() {
        $("#fileChooser").click();
    }

    $scope.fileUpload = function() {

        console.log($scope.quiet.wx);

        var files = document.querySelector('input[name="fileChooser"]').files;
        for (var i = 0; i < files.length; i++) {
            $scope.quiet.images.push(files[i]);
        }
    }

    $scope.release = function(e) {

    	var files = $scope.quiet.files;

    	console.log(files);

    	var f = new window.FormData();

    	for (var i = 0; i <files.length; i++) {
    		f.append('file', files[i], files[i].name);
    	}

    	$.ajax({
            url:'/tanyp/media/upload',
            type: 'POST',
            data: f,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function(returndata) {
                alert(returndata);
            },
            error: function(returndata) {
                alert(returndata);
            }
        });
    }



});