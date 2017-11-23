var user = angular.module('user', ['ngResource', 'ngCookies']);
user.controller('userCtrl', function ($scope, $http, $timeout, $interval, $state, $cookies, $rootScope, userService, projectService) {
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
    $scope.userinfo.itemsPerPage = 2000;
    $scope.roles = [];
    $scope.roles_master = [];

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
    $scope.addIpminstUser = function (openid, companyid,index) {
        $scope.roles.length = 0;
        $scope.add_user_info = {
            openid: openid,
            company_id: companyid,
            index:index
        };
        grouplist();
    };
    $scope.addIpminstUser_submit = function () {


        if (!$scope.roles[0] && !$scope.roles[1] && !$scope.roles[2] && !$scope.roles[3]
            && !$scope.roles[4] && !$scope.roles[5] && !$scope.roles[6]) {
            alert("必须指定一个角色权限！");
        }
        else {
            $scope.roles_INT = 0;
            if ($scope.roles[0])
                $scope.roles_INT = $scope.roles_INT + 1;
            if ($scope.roles[1])
                $scope.roles_INT = $scope.roles_INT + 2;
            if ($scope.roles[2])
                $scope.roles_INT = $scope.roles_INT + 4;
            if ($scope.roles[3])
                $scope.roles_INT = $scope.roles_INT + 8;
            if ($scope.roles[4])
                $scope.roles_INT = $scope.roles_INT + 16;
            if ($scope.roles[5])
                $scope.roles_INT = $scope.roles_INT + 32;
            if ($scope.roles[6])
                $scope.roles_INT = $scope.roles_INT + 64;

            $('#modal-form-mozhang').modal('show');
        }
    }
    $scope.add = function (bl) {
        $scope.roles_master_INT = 0;
        if(bl)
        {
            if ($scope.roles_master[0])
                $scope.roles_master_INT = $scope.roles_master_INT + 1;
            if ($scope.roles_master[1])
                $scope.roles_master_INT = $scope.roles_master_INT + 2;
            if ($scope.roles_master[2])
                $scope.roles_master_INT = $scope.roles_master_INT + 4;
            if ($scope.roles_master[3])
                $scope.roles_master_INT = $scope.roles_master_INT + 8;
            if ($scope.roles_master[4])
                $scope.roles_master_INT = $scope.roles_master_INT + 16;
            if ($scope.roles_master[5])
                $scope.roles_master_INT = $scope.roles_master_INT + 32;
            if ($scope.roles_master[6])
                $scope.roles_master_INT = $scope.roles_master_INT + 64;
        }
        $scope.add_user_info.roles_INT = $scope.roles_INT;
        $scope.add_user_info.roles_master_INT = $scope.roles_master_INT;
        userService.add_ipminst_user($scope.add_user_info).then(
            function (res) {
                if (res.data.success) {
                    alert('添加成功！');
                    $('#modal-form-mozhang').modal('hide');
                    $('#modal-form-adduser').modal('hide');
                    $scope.ipm_list[$scope.add_user_info.index].company_id = 1;
                }
                else {
                    alert('添加失败!');
                }
            }
        )
    }

    $scope.delIpminstUser = function (openid,index) {
        userService.del_ipminst_user(openid).then(
            function (res) {
                if (res.data.success) {
                    alert('删除成功！');
                    $scope.ipm_list[index].company_id = 0;
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
