var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'ngAnimate', 'ngCookies', 'quiet.directive']);
app.controller('indexCtrl', function($scope, $http, $uibModal, $log, $cookies) {

    $scope.status = false;
    if ($cookies.get("user")) {
        $scope.user = angular.fromJson($cookies.get("user")) ;
        $scope.status = true;
    }

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
        $scope.edchange();
    }, false);

    $scope.edblur = function() {
        var code = document.querySelector(".editor")
        code.style.boxShadow = "0 0 0 1px #ccc";
    }

    $scope.edfocus = function() {
        var code = document.querySelector(".editor")
        code.style.boxShadow = "0 0 0 1px #027fff";
    }

    $scope.edchange = function(){
        var btn = document.querySelector(".release-btn");
        if (($scope.quiet.posts && $scope.quiet.posts.length > 0) ||  $scope.quiet.files.length > 0) {
            btn.removeAttribute("disabled");
        }else{
            btn.setAttribute("disabled", "disabled");
        }
    }


    $scope.upload = function() {
        $("#fileChooser").click();
    }

    $scope.release = function(e) {
        // var files = $scope.quiet.files;
        // var f = new window.FormData();
        // for (var i = 0; i < files.length; i++) {
        //     console.log(files[i].size);
        //     f.append('file', files[i], files[i].name);
        // }
        // $.ajax({
        //     url: '/tanyp/media/upload',
        //     type: 'POST',
        //     data: f,
        //     async: false,
        //     cache: false,
        //     contentType: false,
        //     processData: false,
        //     success: function(returndata) {
        //         alert(returndata);
        //     },
        //     error: function(returndata) {
        //         alert(returndata);
        //     }
        // });
    }

    $scope.login = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/html/model/login.html', //script标签中定义的id
            controller: 'LoginModalCtrl',
            // controllerAs: '$ctrl',
            // appendTo: parentElem,
            size: 'xss',
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            // $log.info(selectedItem);
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        }).catch(console.error);
    }

    $scope.register = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/html/model/register.html',
            controller: 'RegisterModalCtrl',
            size: 'xss',
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            // $log.info(selectedItem);
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        }).catch(console.error);
    }

    $scope.logout = function(){
        $cookies.remove("user");
        $http.post('/tanyp/u/logout');
        location.reload();

    }

});

app.controller('LoginModalCtrl', function($scope, $uibModalInstance, items, $http, $cookies) {


    $scope.login = function() {
        if ($scope.email) {
            var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            if (!reg.test($scope.email)) {
                var email = document.getElementById('login-email');
                email.style.border = "1px solid red";
            } else {
                if ($scope.pwd) {
                    if ($scope.pwd.length >= 6) {
                        var user = {
                            "email": $scope.email,
                            "pwd": $scope.pwd
                        }
                        $http.post('/tanyp/u/login', user).then(function(res) {
                            res = res.data;
                            if (res.ret) {
                                var user = angular.toJson(res.data);
                                console.log(res.data);
                                var die = new Date();
                                // die.setDate(die.getDate() + 1);
                                die.setMinutes(die.getMinutes () + 10);
                                $cookies.put("user", user,{'expires': die});
                                $uibModalInstance.close();
                                location.reload();
                            }
                        });
                    } else {
                        var pwd = document.getElementById('login-pwd');
                        pwd.style.border = "1px solid red";
                    }
                } else {
                    var pwd = document.getElementById('login-pwd');
                    pwd.style.border = "1px solid red";
                }
            }
        } else {
            var email = document.getElementById('login-email');
            email.style.border = "1px solid red";
        }
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };


    $scope.efocus = function() {
        var email = document.querySelector("#login-email");
        email.style.border = "1px solid #027fff";
    }
    $scope.pfocus = function() {
        var pwd = document.querySelector("#login-pwd");
        pwd.style.border = "1px solid #027fff";
    }

    $scope.eblur = function() {
        var email = document.querySelector("#login-email");
        email.style.border = "1px solid #ccc";
    }
    $scope.pblur = function() {
        var pwd = document.querySelector("#login-pwd");
        pwd.style.border = "1px solid #ccc";
    }



});

app.controller('RegisterModalCtrl', function($scope, $uibModalInstance, items, $http) {

    $scope.sendCode = function(email) {
        var e = document.getElementById('register-email');
        if (email) {
            var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            if (!reg.test(email)) {
                e.style.border = "1px solid red";
            } else {
                $http.post('/tanyp/send/mail?email=' + email).then(function(res) {
                    res = res.data;
                    if (res.ret) {
                        var code = document.querySelector("#register-code");
                        code.removeAttribute("disabled");
                        $scope.sendNum();
                    }
                });
            }
        } else {
            e.style.border = "1px solid red";
        }
    }
    var countdown = 60;
    $scope.sendNum = function() {
        var fileInput = document.querySelector(".send-code");
        if (countdown == 0) {
            fileInput.removeAttribute("disabled");
            fileInput.innerHTML = "获取校验码";
            countdown = 60;
        } else {
            fileInput.setAttribute("disabled", true);
            fileInput.innerHTML = "重新发送(" + countdown + ")";
            countdown--;
            setTimeout(function() {
                $scope.sendNum();
            }, 1000)
        }
    }

    $scope.efocus = function() {
        var email = document.querySelector("#register-email");
        email.style.border = "1px solid #027fff";
    }
    $scope.pfocus = function() {
        var password = document.querySelector("#register-password");
        password.style.border = "1px solid #027fff";
    }

    $scope.cfocus = function() {
        var code = document.querySelector("#register-code")
        code.style.border = "1px solid #027fff";
    }

    $scope.eblur = function() {
        var email = document.querySelector("#register-email");
        email.style.border = "1px solid #ccc";
    }
    $scope.pblur = function() {
        var password = document.querySelector("#register-password");
        password.style.border = "1px solid #ccc";
    }

    $scope.cblur = function() {
        var code = document.querySelector("#register-code")
        code.style.border = "1px solid #ccc";
    }


    $scope.register = function() {

        if ($scope.email) {
            if ($scope.password && $scope.password.length >= 6) {
                if ($scope.checkCode) {
                    var user = {
                        "email": $scope.email,
                        "pwd": $scope.password,
                        "code": $scope.checkCode
                    };
                    $http.post('/tanyp/u/register', user).then(function(res) {
                        res = res.data;
                        if (res.ret) {
                            countdown = 0;
                            $uibModalInstance.close();
                        } else {
                            $scope.prompt = res.msg;
                        }
                    });
                } else {
                    document.querySelector("#register-code").style.border = "1px solid red";
                }
            } else {
                document.querySelector("#register-password").style.border = "1px solid red";
            }
        } else {
            document.querySelector("#register-email").style.border = "1px solid red";
        }
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});