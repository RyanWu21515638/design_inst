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
    $scope.index = 0;
    $scope.subindex = 0;
    //获取所有项目列表--包括总项目下面的子项目
    $scope.prj_list = $rootScope.prj_list;

    $scope.subprj_dt = function (subindex, prjid, media) {
        $state.go("index.project.subproject_info", {index: $scope.index, subindex: subindex});
    }
    //if (parseFloat($scope.subindex).toString() != "NaN") {
        projectService.project_list($scope.userinfo).then(
            function (res) {
                $scope.prj_list = res.data;
                console.log($scope.prj_list);
                $http.get('http://192.168.3.168/design_institute/public/home/Projecttrailinfo/getProjecttrailinfos?' +
                    'prj_id=' + $scope.prj_list[$scope.index].subproject_list[$scope.subindex].project_id +
                    '&subproject_id=' + $scope.prj_list[$scope.index].subproject_list[$scope.subindex].subproject_id).success(
                    function (res) {
                        $scope.opt_prj_list = res;
                        $scope.imglist = new Array();
                        for(var i=0;i<$scope.opt_prj_list.length;i++)
                        {
                            $scope.imglist[i] = $scope.opt_prj_list[i].headimgurl;
                        }
                        $scope.imglist = DropRepeat($scope.imglist);
                        console.log($scope.imglist);
                    }).error(function () {
                    alert("an unexpected error ocurred!");
                })
            }
        )
    //}

    $scope.bindquery = function (x) {
        $scope.query = x;
    }
    DropRepeat = function(arr){
        // 遍历arr，把元素分别放入tmp数组(不存在才放)
        var tmp = new Array();
        for(var i=0;i<arr.length;i++){
            //该元素在tmp内部不存在才允许追加
            if(tmp.indexOf(arr[i])==-1){
                tmp.push(arr[i]);
            }
        }
        return tmp;
    }

})
