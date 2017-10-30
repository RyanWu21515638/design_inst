var subproject = angular.module('subproject', ['ngResource', 'ngCookies']);
subproject.controller('subprojectCtrl', function ($scope, $http, $timeout, $interval, $window, $stateParams, $state, $cookies,
                                                  $rootScope, projectService) {

    $scope.userinfo = {};               //用户信息
    $scope.prjinfo = {};                //创建总项目信息
    $scope.subprjinfo = {};             //创建子项目信息
    $scope.rolesinfo = {};              //子项目已分配的人员信息
    $scope.removeinfo = {};             //移除的已分配的人员信息
    $scope.downloadinfo = {};           //所有文件下载链接列表
    $scope.roles = new Array();         //给某个人员分配权限

    //获取用户微信id，公司id，设计院权限--可设置成全局变量
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.status = $cookies.get('status');
    //

    $scope.index = $stateParams.index;
    $scope.subindex = $stateParams.subindex;
   /* $scope.index = 0;
    $scope.subindex = 0;*/
    //获取所有项目列表--包括总项目下面的子项目
    $scope.prj_list = $rootScope.prj_list;

    $scope.subprj_dt = function (subindex, prjid, media) {
        $state.go("index.project.subproject_info", {index: $scope.index, subindex: subindex});
    }
    //if (parseFloat($scope.subindex).toString() != "NaN") {

    //}




})
