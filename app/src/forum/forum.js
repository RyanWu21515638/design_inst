
var forum = angular.module('forum', ['ngResource', 'ngCookies']);
forum.controller('forumCtrl', function ($scope, $location, $timeout, $interval, $state, $cookies, $rootScope,projectService) {

    $scope.userinfo = {};
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');

    console.log($location.search().name);
    console.log($location.search().age);
    console.log($location.search().gender);

    projectList = function () {
        projectService.project_list($scope.userinfo).then(
            function (res) {
                $scope.prj_list = res.data;
            }
        )
    };
    projectList();

    $scope.dbclick = function () {
        $scope.oldtb = false;
    }
})
forum.config(['$locationProvider', function($locationProvider) {
     //$locationProvider.html5Mode(true);
    /*$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });*/
}]);