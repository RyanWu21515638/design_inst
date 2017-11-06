var conf = angular.module('conf', ['ngResource', 'ngCookies']);
conf.controller('confCtrl', function ($scope, $http, $filter,$timeout, $interval, $window, $state, $cookies, $location,
                                            $rootScope, projectService) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

    $scope.userinfo = {};               //用户信息

    //获取用户微信id，公司id，设计院权限--可设置成全局变量
    //
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.headimgurl = $cookies.get('headimgurl');
    $scope.userinfo.company_name = $cookies.get('company_name');
    $scope.userinfo.nickname = $cookies.get('nickname');
    $scope.userinfo.status = $cookies.get('status');


    //获取公司配置列表
        projectService.configuration_list($scope.userinfo).then(
            function (res) {
                $scope.conf_list = res.data;
            }
        )


    $scope.delConf = function (conf_id) {
        projectService.del_config(conf_id).then(
            function (res) {
                console.log(res.data);
                if (!res.data.success) {
                    alert("此配置正在被使用，无法删除！");
                }
                else {
                    $window.location.reload();
                }

            }
        )
    }





})
