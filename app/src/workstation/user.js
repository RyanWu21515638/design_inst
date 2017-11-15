var user = angular.module('user', ['ngResource', 'ngCookies']);
user.controller('userCtrl', function ($scope, $http, $timeout, $interval, $state, $cookies, $rootScope, userService) {
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
    $scope.prj_dt = function (index) {
        $scope.index = index;
    }
    $scope.addIpminstUser = function (openid, companyid) {
        $scope.userinfo.currentPage = 1;
        $scope.ipm_list = [];
        j = -1;
        userService.add_ipminst_user(openid, companyid).then(
            function (res) {
                if (res.data.success) {
                    alert('添加成功！');
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
                    alert('添加失败!');
                }

            }
        )
    };

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
