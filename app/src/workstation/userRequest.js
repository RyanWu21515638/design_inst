user.service('userService', function ($resource, $http, $rootScope) {
    this.postCfg = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        //headers: {'Content-Type': 'application/json'},
        transformRequest: function (data) {
            return $.param(data);
        }
    };
    this.user_list = function (data) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/User/Userlist?company_id=' + data.company_id + '&status=' + data.status);
    }
    this.company_project_list = function (data) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/Company/company_project_list?company_id=' + data.company_id);
    }
    this.company_list = function () {
        return $http.get($rootScope.ip + '/design_institute/public/admin/Company/company_list');
    }
    this.ipm_user_list = function (data1) {

        return $http.get($rootScope.ip + '/design_institute/public/admin/User/ipm_user_list?company_id=' + data1.company_id +
            '&currentpage=' + data1.currentPage + '&itemsPerPage=' + data1.itemsPerPage);
    }
    this.add_ipminst_user = function (data) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/User/add_ipminst_user?openid=' + data.openid +
            '&company_id=' + data.company_id + '&role_id=' +data.roles_INT);
    }
    this.del_ipminst_user = function (openid) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/User/del_ipminst_user?openid=' + openid);
    }
});