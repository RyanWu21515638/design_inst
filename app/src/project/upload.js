var upload = angular.module('upload', ['ngResource', 'ngCookies']);
upload.controller('uploadCtrl', function ($scope, $http, $timeout, $interval, $window, $stateParams, $state, $cookies,
                                          $rootScope) {

    //document.getElementById('import1').action = $rootScope.ip+"/design_institute/public/admin/Config/upload_Config";

    $scope.init = function() {
        // to do
        document.getElementById('import').action = $rootScope.ip+"/design_institute/public/admin/Config/upload_Config";
    }

    function OnArxCallback(res) {
        var response = JSON.parse(res);
        if(response.success)
        {
            $window.location.reload();
        }
    }

    $scope.choseConf = function () {
        execAsync(JSON.stringify({
                functionName: 'UploadConfig',
                functionParams: {args: {}},
                invokeAsCommand: false
            }),
            OnArxCallback,
            OnArxCallback
        );
    }

});
