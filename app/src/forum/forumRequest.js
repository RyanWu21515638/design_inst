forum.service('forumService', function ($resource, $http, $rootScope) {
    this.postCfg = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        //headers: {'Content-Type': 'application/json'},
        transformRequest: function (data) {
            return $.param(data);
        }
    };
    this.type_list = function () {
        return $http.get($rootScope.ip+'/design_institute/public/admin/Problemtype/type_list')
    }
    this.subtype_list = function (type_id) {
        return $http.get($rootScope.ip+'/design_institute/public/admin/Problemsubtype/subtype_list?type_id='+type_id)
    }
    this.problem_list = function (data) {
        return $http.get($rootScope.ip+'/design_institute/public/admin/Problem/problem_list?company_id='+data.company_id+'&project_id='
            + data.project_id+'&subproject_id=' +data.subproject_id)
    }
});