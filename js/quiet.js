var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'ngAnimate']);
// app.config(['$qProvider', function ($qProvider) {
//     $qProvider.errorOnUnhandledRejections(false);
// }]);
app.controller('QuietCtrl1', function($scope, $http, $uibModal, $log) {


    


    // $scope.search = function(start, limit) {
    //     if (!start || !limit) {
    //         $scope.start = 0;
    //         $scope.limit = 10;
    //     } else {
    //         $scope.start = start;
    //         $scope.limit = limit;
    //     }

    //     $http.post('/quiet/articles', { "start": $scope.start, "limit": $scope.limit }).then(function(res) {
    //         res = res.data;
    //         if (res.ret) {
    //             res.data[0].praise = 0;
    //             res.data[0].tread = 0;
    //             res.data[0].comment = 0;
    //             res.data[0].commentText = '呵呵';
    //             $scope.textList = res.data;
                // for (var i = 0; i < res.data.length; i++) {
                //     $('.list-text').append("<div class='panel panel-default ng-scope'>" +
                //         "<div class='panel-body' style='padding-bottom:0px;'>" +
                //         "<img src='img/head1.png' style='width: 50px;height: 50px;' alt='...' class='img-circle'>" + res.data[i].created +
                //         "<span class='glyphicon glyphicon-chevron-up' style='float:right;'></span>" +
                //         "</div>" +
                //         "<div class='panel-body'>" +
                //         "<pre style='border: none; background-color: transparent;' class='ng-binding'>" + res.data[i].text + "</pre>" +
                //         "<hr style='margin-bottom: 0px; margin-top: 0px'>" +
                //         "<div class='review'>" +
                //         "<ul>" +
                //         "<li class='glyphicon glyphicon-thumbs-up'>" + (res.data.praise > 0 ? res.data.praise : '赞') + "</li>" +
                //         "<li class='glyphicon glyphicon-thumbs-down'>踩</li>" +
                //         "<li class='glyphicon glyphicon-edit'>评论</li>" +
                //         "</ul>" +
                //         "</div>" +
                //         "</div>" +
                //         "</div>");
                // }
    //         }
    //     });
    // }

    // $scope.search();

    $scope.praise = function(praise) {
        praise.praise++;
    }

    $scope.tread = function(tread) {
        tread.tread++;
    }

    $scope.comment = function(comment) {
        $("#" + comment.articleId).slideToggle("slow");
    }

    $scope.delete = function(){
        console.log("delete");
    }

    $scope.report = function(){
        console.log("report");
    }

    $scope.addAomment = function(comment) {
        if (!comment.commentText) {
            console.log("不支持空评论，感谢配合！");
            return;
        }
        comment.comment++;

        var table = document.body.querySelector('.comment-text');
        if (table.childNodes[4]) {
            table.childNodes[4].style = 'display: none';
        }
        $("<div class='panel-body' style='margin-left:9.5px;padding-top:0px;'>" +
            "<img src='img/head1.png' style='width: 30px;height: 30px; margin-right:5px;'' alt='...'' class='img-circle'>" +
            new Date().Format("yyyy-MM-dd HH:mm") +
            "<div class='panel-body' style='margin-left:30px; padding:5px;'>" + comment.commentText +
            "</div>" +
          "</div>").insertAfter("#" + comment.articleId);
        comment.commentText = '';
    }


    $scope.items = ['item1', 'item2', 'item3'];

    $(".quiet-textarea").focus(function() {
        $(".quiet-text").slideDown("slow");
    });

    // $(".quiet-textarea").blur(function() {
    //     $(".quiet-text").slideUp("slow");
    // });

    // 对Date的扩展，将 Date 转化为指定格式的String  
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    Date.prototype.Format = function(fmt) { //author: meizz   
        var o = {
            "M+": this.getMonth() + 1, //月份   
            "d+": this.getDate(), //日   
            "H+": this.getHours(), //小时   
            "m+": this.getMinutes(), //分   
            "s+": this.getSeconds(), //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    $scope.signNum = 0;

    $scope.release = function(text) {
        if (!text) {
            $(".msg").show();
            setTimeout(function() {
                $(".msg").hide();
            }, 5000)
        } else {
            $http.post('/quiet/release', { "text": text });
            var table = document.body.querySelector('.list-text');
            table.childNodes[10].style = 'display: none';
            var div = document.createElement('div');
            div.id = 'new-text-' + $scope.signNum;
            div.style = 'display: none';
            div.className = 'panel panel-default ng-scope';
            div.innerHTML = "<div class='panel-body'>" +
                "<img src='img/head1.png' style='width: 50px;height: 50px;' alt='...' class='img-circle'>" + new Date().Format("yyyy-MM-dd HH:mm") +
                "<span class='glyphicon glyphicon-chevron-up' style='float:right;'></span>" +
                "</div>" +
                "<div class='panel-body'>" +
                "<pre style='border: none; background-color: transparent;' >" + text + "</pre>" +
                "<hr style='margin-bottom: 0px; margin-top: 0px'>" +
                "<div class='review'>" +
                "<ul>" +
                "<li class='glyphicon glyphicon-thumbs-up'>赞</li>" +
                "<li class='glyphicon glyphicon-thumbs-down'>踩</li>" +
                "<li class='glyphicon glyphicon-edit'>评论</li>" +
                "</ul>" +
                "</div>" +
                "</div>";
            table.insertBefore(div, table.childNodes[0]);
            $scope.text = '';
            $('#new-text-' + $scope.signNum).slideDown("slow");
            $scope.signNum++;
        }
    }
    $scope.cancel = function(text) {
        $scope.text = '';
        $(".msg").hide();
    }

    $scope.register = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/html/model/register.html', //script标签中定义的id
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
            // $log.info(selectedItem);
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        }).catch(console.error);
    }


});

//模态框对应的Controller
app.controller('QuietModalCtrl', function($scope, $uibModalInstance, items) {

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});

angular.module('app').controller('CarouselDemoCtrl', function($scope) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    var currIndex = 0;

    $scope.addSlide = function() {
        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: '//unsplash.it/' + newWidth + '/300',
            text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
            id: currIndex++
        });
    };

    $scope.randomize = function() {
        var indexes = generateIndexesArray();
        assignNewIndexesToSlides(indexes);
    };

    for (var i = 0; i < 4; i++) {
        $scope.addSlide();
    }

    // Randomize logic below

    function assignNewIndexesToSlides(indexes) {
        for (var i = 0, l = slides.length; i < l; i++) {
            slides[i].id = indexes.pop();
        }
    }

    function generateIndexesArray() {
        var indexes = [];
        for (var i = 0; i < currIndex; ++i) {
            indexes[i] = i;
        }
        return shuffle(indexes);
    }

    // http://stackoverflow.com/questions/962802#962890
    function shuffle(array) {
        var tmp, current, top = array.length;

        if (top) {
            while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
        }

        return array;
    }
});