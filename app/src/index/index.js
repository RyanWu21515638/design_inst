var index = angular.module('index', ['ngResource', 'ngCookies']);
index.controller('indexCtrl', function ($scope, $timeout, $interval, $state, $cookies, $rootScope, $http , $window) {

    //
    // http://120.25.74.178/ipmwx/Home/Qrcode/index  生产sceneid、ticket
    $scope.userinfo = {

    };
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    $scope.userinfo.headimgurl = $cookies.get('headimgurl');
    $scope.logged = $cookies.get('logged');
    $scope.userinfo.status = $cookies.get('status');
    $scope.pollScan = function () {
        $http.get('http://120.25.74.178/ipmwx/Home/Qrcode/pollScan?scene_id='+$scope.userinfo.scene_id).success(
            function (res) {
                if(res.openid)
                {

                    $cookies.put('headimgurl', res.headimgurl, {'expires': expireDate});
                    $cookies.put('nickname', res.nickname, {'expires': expireDate});
                    $cookies.put('openid', res.openid, {'expires': expireDate});
                    $interval.cancel($scope.timer1);
                    selectUser(res.openid);
                }
            }).error(function () {
            alert("an unexpected error ocurred!");
        })
    };

    $scope.register_post = function () {
        $scope.logged = 'false';
        $cookies.put('logged', 'false', {'expires': expireDate});
        $http.get('http://120.25.74.178/ipmwx/Home/Qrcode/index').success(
            function (res) {
                $scope.userinfo = res;
                $scope.timer1 = $interval($scope.pollScan,1000);
            }).error(function () {
            alert("an unexpected error ocurred!");
        });
    };
    /*if($cookies.get('logged') == 'false' || $cookies.get('logged')== null || $cookies.get('logged')== '')
    {
        $scope.register_post();
        $("#modal-form").modal("show");
    }
    else
    {
        $state.go('index.project.project_info');
    }*/


    function delAllCookie(){
        /*var myDate=new Date();
        myDate.setTime(-1000);//设置时间*/
        var data=document.cookie;
        var dataArray=data.split("; ");
        for(var i=0;i<dataArray.length;i++){
            var varName=dataArray[i].split("=");
            console.log(varName[0]);
            $cookies.put(varName[0],'');

            $scope.t2 = $timeout(function() {
                $window.location.reload();
            })
        }
    }
    $scope.logout = function () {
        delAllCookie();
    }
    selectUser = function (openid) {
        $http.get("http://192.168.3.158/design_institute/public/home/user/selectUser?openid="+openid).success(
            function (res) {
                if(res.company_id)
                {
                    $scope.logged = 'true';

                    $scope.t1 = $timeout(function(){
                        $('#modal-form').modal('hide');

                        $cookies.put('logged', 'true', {'expires': expireDate});
                        $cookies.put('status', res.status, {'expires': expireDate});
                        $cookies.put('company_id', res.company_id, {'expires': expireDate});
                        $cookies.put('company_name', res.company_name, {'expires': expireDate});
                        $window.location.reload();
                    },600);
                    $state.go('index.project.project_info');
                }
            }
        )

    };
})

