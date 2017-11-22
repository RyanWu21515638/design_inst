var upload = angular.module('upload', ['ngResource', 'ngCookies']);
upload.controller('uploadCtrl', function ($scope, $http, $timeout, $interval, $window, $stateParams, $state, $cookies,
                                          $rootScope) {

    //document.getElementById('import1').action = $rootScope.ip+"/design_institute/public/admin/Config/upload_Config";

    $scope.init = function () {
        // to do
        document.getElementById('import').action = $rootScope.ip + "/design_institute/public/admin/Config/upload_Config";
    }

    function OnArxCallback(res) {
        var response = JSON.parse(res);
        alert('1111');
        alert(response.message);
        if (response.success) {
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

    $scope.setPrj = function (prj_id, subprj_id) {
        console.log(prj_id + '-' + subprj_id);
        execAsync(JSON.stringify({
                functionName: 'SetSelectPrj',
                functionParams: {
                    args: {
                        prj_id: prj_id,
                        subprj_id: subprj_id
                    }
                },
                invokeAsCommand: false
            }),
            OnArxCallback,
            OnArxCallback
        );
    }

});
