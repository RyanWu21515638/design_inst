var forum = angular.module('forum', ['ngResource', 'ngCookies']);
forum.controller('forumCtrl', function ($scope, $location, $http,$timeout, $interval, $window,$state, $cookies, $rootScope,
                                        $stateParams,projectService, forumService) {


    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

    console.log($location.search().openid);
    console.log($location.search().company_id);
    console.log($location.search().project_id);
    console.log($location.search().subproject_id);

    $scope.detail=function(index)
    {
        $state.go("index.forum.forum_detail",{index: index});
    }
    $scope.prb_list_index = $stateParams.index;
    console.log($scope.prb_list_index);
    $scope.prb_sovle_desc = '';
//keyVal==undefined || keyVal=="" || keyVal==null
    selectUser = function (openid) {
        $http.get("http://192.168.3.158/design_institute/public/admin/user/selectUser?openid=" + openid).success(

            function (res) {
                if (res.company_id) {
                    $scope.logged = 'true';
                    $cookies.put('logged', 'true', {'expires': expireDate});
                    $cookies.put('status', res.status, {'expires': expireDate});
                    $cookies.put('company_id', res.company_id, {'expires': expireDate});
                    $cookies.put('company_name', res.company_name, {'expires': expireDate});
                    $cookies.put('headimgurl', res.headimgurl, {'expires': expireDate});
                    $cookies.put('nickname', res.nickname, {'expires': expireDate});
                    $cookies.put('openid', $location.search().openid, {'expires': expireDate});
                    $scope.userinfo.openid = $location.search().openid;
                    $scope.userinfo.company_id = $cookies.get('company_id');
                    $scope.userinfo.headimgurl = $cookies.get('headimgurl');
                    $scope.userinfo.company_name = $cookies.get('company_name');
                    $scope.userinfo.nickname = $cookies.get('nickname');
                    $scope.probleminfo.company_id = $cookies.get('company_id');
                    $scope.probleminfo.project_id = $location.search().project_id;
                    $scope.probleminfo.subproject_id = $location.search().subproject_id;
                    projectList();
                    typeList();
                    problemList();
                    $window.location.reload();
                }
            }
        )
    };
    console.log($cookies.get('openid'));
    if($cookies.get('openid') == undefined || $cookies.get('openid') == '' ||$cookies.get('openid') == null)
    {
        console.log($location.search().openid);
        selectUser($location.search().openid);
    }

    //if($location.search().openid !=undefined && $location.search().openid !=undefined!="" &&$location.search().openid !=undefined!=null)
    /*if($location.search().openid !='')
    {
        selectUser($location.search().openid);
        $scope.tt1 = $timeout(function(){
            $window.location.reload();
        },1000);

    }*/



    $scope.userinfo = {};
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.headimgurl = $cookies.get('headimgurl');
    $scope.userinfo.company_name = $cookies.get('company_name');
    $scope.userinfo.nickname = $cookies.get('nickname');
    $scope.probleminfo = {};
    $scope.probleminfo.company_id = $cookies.get('company_id');
    $scope.probleminfo.project_id = $cookies.get('project_id');
    $scope.probleminfo.subproject_id = $cookies.get('subproject_id');
    $scope.newprobleminfo = {};
    projectList = function () {
        projectService.project_list($scope.userinfo).then(
            function (res) {
                $scope.prj_list = res.data;
                for (var i = 0; i < $scope.prj_list.length; i++) {
                    if ($scope.prj_list[i].project_id == $scope.probleminfo.project_id)
                        $scope.index = i;
                }
            }
        )
    };
    typeList = function () {
        forumService.type_list().then(
            function (res) {
                $scope.tp_list = res.data;
            }
        )
    }
    subtypeList = function () {
        forumService.subtype_list($scope.newprobleminfo.type_id).then(
            function (res) {
                $scope.subtp_list = res.data;
            }
        )
    }
    problemList = function () {
        forumService.problem_list($scope.probleminfo).then(
            function (res) {
                $scope.prb_list = res.data;
            }
        )
    }
    projectList();
    typeList();
    problemList();


    $scope.dbclick = function () {
        $scope.oldtb = false;
    }
    $scope.projectselect = function (prjid) {
        for (var i = 0; i < $scope.prj_list.length; i++) {
            if ($scope.prj_list[i].project_id == prjid)
                $scope.index = i;
        }
        $scope.probleminfo.project_id = prjid;
        $scope.newprobleminfo.project_id = prjid;
        $cookies.put('project_id',prjid);
    }
    $scope.subprojectselect = function (subprjid) {
        $scope.probleminfo.subproject_id = subprjid;
        $scope.newprobleminfo.subproject_id = subprjid;
        $cookies.put('subproject_id',subprjid);
        problemList();
    }
    $scope.typeselect = function (typeid) {
        $scope.newprobleminfo.type_id = typeid;
        subtypeList();
    }
    $scope.showdata = function () {
        console.log($scope.newprobleminfo);
    }
})
forum.config(['$locationProvider', function ($locationProvider) {
    //$locationProvider.html5Mode(true);
    /*$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });*/
}]);