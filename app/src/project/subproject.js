var subproject = angular.module('subproject', ['ngResource', 'ngCookies']);
subproject.controller('subprojectCtrl', function ($scope, $http, $timeout, $interval, $window, $stateParams, $state, $cookies,
                                                  $rootScope, projectService) {

    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
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

    //获取所有项目列表--包括总项目下面的子项目
    $scope.prj_list = $rootScope.prj_list;
    $rootScope.menu = false;

    projectList = function () {
        $scope.userinfo.openid = $cookies.get('openid');
        $scope.userinfo.company_id = $cookies.get('company_id');
        $scope.userinfo.headimgurl = $cookies.get('headimgurl');
        $scope.userinfo.company_name = $cookies.get('company_name');
        $scope.userinfo.nickname = $cookies.get('nickname');
        $scope.userinfo.status = $cookies.get('status');
        $scope.userinfo.currentPage = 1;
        $scope.userinfo.itemsPerPage = 1000;
        projectService.project_list($scope.userinfo).then(
            function (res) {
                $scope.prj_list = res.data;
                $scope.prj_id = $scope.prj_list[$scope.index].project_id;
                $scope.prj_name = $scope.prj_list[$scope.index].name;
                /*for(var i= 0;i<$scope.prj_list.length;i++)
                {
                    for(var j = 0;j<$scope.prj_list[i].subproject_list.length;j++)

                }*/

            }
        )
    };
    projectList();

    $scope.subprjChose = function (sub_index) {
        $scope.status_list = [];
        $scope.subprj_id = $scope.prj_list[$scope.index].subproject_list[sub_index].subproject_id;
        $scope.subprj_name = $scope.prj_list[$scope.index].subproject_list[sub_index].name;
        projectService.find_state($scope.subprj_id).then(
            function (res) {
                if(res.data.success == false)
                {
                    $scope.status_select = false;
                }
                else
                {
                    $scope.status_select = true;
                    $scope.status_list = res.data;
                }
            }
        )

    }
    $scope.subprj_dt = function () {

        projectService.project_role_list($scope.subprj_id).then(
            function (res) {
                $scope.prj_role_list = res.data;
                $state.go("index.project.subproject_info_detail",{prj_id:$scope.prj_id,subprj_id:$scope.subprj_id});
            }
        )
    }
    $scope.getSubPrjStatus = function () {

    }
})
