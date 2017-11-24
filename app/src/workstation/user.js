var user = angular.module('user', ['ngResource', 'ngCookies']);
user.controller('userCtrl', function ($scope, $http, $timeout, $interval, $state, $cookies, $rootScope,
                                      userService, projectService, locals) {
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

    var time = new Date();
    var j=-1;
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
                locals.set("ipm_list", JSON.stringify($scope.ipm_list));
                locals.set("cashe_time",time.getDate());
                $scope.ipm_list = JSON.parse(locals.get("ipm_list"));
            }
        )
    }
    if($scope.userinfo.company_id != 1)
    {
        $state.go("index");
    }
    else {
        if (locals.get("ipm_list") == '' || locals.get("ipm_list") == null || locals.get("ipm_list") == undefined
            || (locals.get("cashe_time") != time.getDate())) {
            ipmList();
        }
        else {
            $scope.ipm_list = JSON.parse(locals.get("ipm_list"));
        }
    }


    grouplist = function () {
        projectService.group_list().then(
            function (res) {
                $scope.grp_list = res.data;
            }
        )
    }

    var findIndexOfOpenid = function (openid) {
        var index = 0;
        for(var i = 0 ; i<$scope.ipm_list.length;i++)
        {
            if($scope.ipm_list[i].openid == openid)
            {
                index = i;
                break;
            }
        }
        return index;
    }
    findIndexOfOpenid('ovMfqvu4l_T7Grk6tQzZTM9EehcI');
    $scope.prj_dt = function (index) {
        $scope.index = index;
    }
    $scope.addIpminstUser = function (openid, companyid, index) {
        $scope.roles.length = 0;
        $scope.add_user_info = {
            openid: openid,
            company_id: companyid,
            index: index
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
        if (bl) {
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
                    var idx = findIndexOfOpenid($scope.add_user_info.openid);
                    $scope.ipm_list[idx].company_id = 1;
                    locals.set("ipm_list", JSON.stringify($scope.ipm_list));
                }
                else {
                    alert('添加失败!');
                }
            }
        )
    }

    $scope.delIpminstUser = function (openid, index) {
        userService.del_ipminst_user(openid).then(
            function (res) {
                if (res.data.success) {
                    alert('删除成功！');

                    var idx = findIndexOfOpenid(openid);
                    $scope.ipm_list[idx].company_id = 0;
                    locals.set("ipm_list", JSON.stringify($scope.ipm_list));
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
user.factory('locals', ['$window', function ($window) {
    return {        //存储单个属性
        set: function (key, value) {
            $window.localStorage[key] = value;
        },        //读取单个属性
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);//将对象以字符串保存
        },        //读取对象
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');//获取字符串并解析成对象
        }

    }
}]);
