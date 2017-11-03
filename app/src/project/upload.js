

var upload = angular.module('upload', ['ngResource', 'ngCookies']);
upload.controller('uploadCtrl', function ($scope, $http, $timeout, $interval, $window, $stateParams, $state, $cookies,
                                                  $rootScope) {

    document.getElementById('import').action = $rootScope.ip+"/design_institute/public/admin/Config/upload_Config";

})
