var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'ngAnimate', 'quiet.directive']);
app.controller('indexCtrl', function($scope, $http, $uibModal, $log) {


    $scope.quiet = {
        images: [],
        files: []
    }


    var fileInput = document.querySelector("#fileChooser");
    var holder = document.getElementById('holder');
    fileInput.addEventListener("change", function(evt) {
        var files = fileInput.files;
        for (var i = 0; i < files.length; i++) {
            files[i].objectURL = window.URL.createObjectURL(fileInput.files[i]);
            $scope.quiet.files.push(files[i]);
        }
        fileInput.setAttribute("type", "text");
        $scope.$apply();
        fileInput.setAttribute("type", "file");
        console.log($scope.quiet.files);

    }, false);

    $scope.upload = function() {
        $("#fileChooser").click();
    }

    $scope.release = function(e) {
        var files = $scope.quiet.files;
        var f = new window.FormData();
        for (var i = 0; i < files.length; i++) {
            console.log(files[i].size);
            f.append('file', files[i], files[i].name);
        }
        $.ajax({
            url: '/tanyp/media/upload',
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

    $scope.login = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/html/model/login.html', //script标签中定义的id
            controller: 'QuietModalCtrl',
            // controllerAs: '$ctrl',
            size: 600,
            // appendTo: parentElem,
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $log.info(selectedItem);
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        }).catch(console.error);
    }

    $scope.register = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/html/model/register.html',
            controller: 'QuietModalCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $log.info(selectedItem);
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        }).catch(console.error);
    }
});
app.controller('QuietModalCtrl', function($scope, $uibModalInstance, items) {

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
