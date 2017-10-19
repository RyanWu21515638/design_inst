
var newforum = angular.module('newforum', ['ngResource', 'ngCookies']);
newforum.controller('newforumCtrl', function ($scope, $location, $timeout, $interval, $state, $cookies, $rootScope,
                                        projectService, forumService) {

    if ($location.search().rs == '1') {
        alert('发帖成功！');
        $state.go('index.forum.forum_items');
    }

});