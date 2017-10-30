user.service('userService', function ($resource, $http, $rootScope) {
    this.postCfg = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        //headers: {'Content-Type': 'application/json'},
        transformRequest: function (data) {
            return $.param(data);
        }
    };
    this.user_list = function (data) {
        return $http.get($rootScope.ip+'/design_institute/public/admin/User/Userlist?company_id='+data.company_id+'&status='+data.status);
    }
    this.company_project_list = function (data) {
        return $http.get($rootScope.ip+'/design_institute/public/admin/Company/company_project_list?company_id='+data.company_id);
    }
    this.company_list = function () {
        return $http.get($rootScope.ip +'/design_institute/public/admin/Company/company_list');
    }
    this.ipm_user_list = function (company_id) {
        return $http.get($rootScope.ip+ '/design_institute/public/admin/User/ipm_user_list?company_id='+company_id);
    }
});