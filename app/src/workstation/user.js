var user = angular.module('user', ['ngResource', 'ngCookies']);
user.controller('userCtrl', function ($scope, $http, $timeout, $interval, $state, $cookies, $rootScope, userService,projectService) {
    $scope.userinfo = {};
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.status = $cookies.get('status');
    $scope.userinfo.headimgurl = $cookies.get('headimgurl');
    //$scope.ipm_list = new Object();
    $scope.ipm_list = new Array();
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 22,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        /*onChange: function () {
        }*/
    };
    $scope.userinfo.currentPage = 1;
    $scope.userinfo.itemsPerPage = 400;
    $scope.roles = [];

    getData = function () {
        //$scope.userinfo.currentPage = $scope.userinfo.currentPage +1;
        ipmList();
    }
    $scope.scrollT_old = 0;

    //定义鼠标滚动事件
    /*$(window).scroll(
        function () {
                var scrtop = $(document).scrollTop();
                var height = $(document).height()-$(window).height();
                if(scrtop >= height)
                {
                    if($scope.refrash)
                    {
                        getData();
                        $('body,html').animate({scrollTop:$(document).height()}, 800);
                    }
                }
        }
    );*/
    //继续加载按钮事件
    $("#btn_Page").click(function () {
        getData();
    });

    /*userList = function () {
        userService.user_list($scope.userinfo).then(
            function (res) {
                $scope.usr_list = res.data;
            }
        )
    };*/
    /*companyProjectList =function () {
        userService.company_project_list($scope.userinfo).then(
            function (res) {
                $scope.company_prj_list = res.data;
            }
        )
    }*/
    /*companyList =function () {
        userService.company_List().then(
            function (res) {
                $scope.comp_list = res.data;
            }
        )
    }*/
    var j = -1;
    ipmList = function () {
        userService.ipm_user_list($scope.userinfo).then(
            function (res) {
                if (res.data.length == 0) {
                    $scope.refrash = false;
                }
                else {
                    $scope.refrash = true;
                }
                for (var i = 0; i < res.data.length; i++) {
                    j++;
                    $scope.ipm_list[j] = res.data[i];
                }
            }
        )
    }
    //userList();
    //companyProjectList();
    ipmList();
    grouplist = function () {
        projectService.group_list().then(
            function (res) {
                $scope.grp_list = res.data;
            }
        )
    }

    $scope.prj_dt = function (index) {
        $scope.index = index;
    }
    $scope.addIpminstUser = function (openid, companyid) {
        $scope.roles.length = 0;
        $scope.add_user_info = {
            openid:openid,
            company_id:companyid
        };
        grouplist();
    };
    $scope.addIpminstUser_submit=function(){


        if (!$scope.roles[0] && !$scope.roles[1]
            && !$scope.roles[2] && !$scope.roles[3]
            && !$scope.roles[4] && !$scope.roles[5]
            && !$scope.roles[6]
        ){
            alert("必须指定一个角色权限！");
        }
        else {
            $scope.roles_INT = 0;
            if($scope.roles[0])
                $scope.roles_INT = $scope.roles_INT + 1;
            if($scope.roles[1])
                $scope.roles_INT = $scope.roles_INT + 2;
            if($scope.roles[2])
                $scope.roles_INT = $scope.roles_INT + 4;
            if($scope.roles[3])
                $scope.roles_INT = $scope.roles_INT + 8;
            if($scope.roles[4])
                $scope.roles_INT = $scope.roles_INT + 16;
            if($scope.roles[5])
                $scope.roles_INT = $scope.roles_INT + 32;
            if($scope.roles[6])
                $scope.roles_INT = $scope.roles_INT + 64;
        }

        $scope.add_user_info.roles_INT = $scope.roles_INT;
        userService.add_ipminst_user($scope.add_user_info).then(
            function (res) {
                if (res.data.success) {
                    alert('添加成功！');
                    userService.ipm_user_list($scope.userinfo).then(
                        function (res) {
                            $scope.ipm_list = res.data;
                        }
                    )
                }
                else {
                    alert('添加失败!');
                }

            }
        )
    }

    $scope.delIpminstUser = function (openid) {
        $scope.userinfo.currentPage = 1;
        $scope.ipm_list = [];
        j = -1;
        userService.del_ipminst_user(openid).then(
            function (res) {
                if (res.data.success) {
                    alert('删除成功！');
                    userService.ipm_user_list($scope.userinfo).then(
                        function (res) {

                            for (var i = 0; i < res.data.length; i++) {
                                j++;
                                $scope.ipm_list[j] = res.data[i];
                            }
                        }
                    )
                }
                else {
                    alert('删除失败!');
                }

            }
        )
    };
    $scope.scrollup = function () {
        $(window).scrollTop(0);
        /*
                $('body').scrollTop(0);

                $('html').scrollTop(0);*/
    }
})
