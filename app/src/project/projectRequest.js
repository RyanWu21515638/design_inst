project.service('projectService', function ($resource, $http, $rootScope) {
    this.postCfg = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        //headers: {'Content-Type': 'application/json'},
        transformRequest: function (data) {
            return $.param(data);
        }
    };
    //获取所有项目信息
    this.project_list = function (data) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/Project/project_list?openid='+data.openid+'&company_id='+data.company_id);
    }
    this.user_list = function (data) {
        return $http.get($rootScope.ip+'/design_institute/public/admin/User/Userlist?company_id='+data.company_id+'&status='+data.status);
    }
    this.configuration_list = function (data) {
        return $http.get($rootScope.ip+'/design_institute/public/admin/Config/Config_list?company_id='+data.company_id)
    }
    this.group_list = function () {
        return $http.get($rootScope.ip+'/design_institute/public/admin/Role/select_role')
    }
    this.new_project = function (data1) {
        var data = {
            company_id:data1.company_id,
            config_id:data1.config_id,
            creator_id:data1.creator_id,
            end_time_plan:data1.end_time_plan,
            openid:data1.openid,
            prjname:data1.prjname,
            role_id:data1.role_id,
            start_time_plan:data1.start_time_plan,
            create_sub:data1.create_sub,
        };
        return $http.post($rootScope.ip + '/design_institute/public/admin/Project/add_project',data, this.postCfg);
    }
    this.new_subproject = function (data1) {
        var data = {
            company_id:data1.company_id,
            prj_id:data1.prj_id,
            creator_id:data1.creator_id,
            end_time_plan:data1.end_time_plan,
            openid:data1.openid,
            prjname:data1.prjname,
            role_id:data1.role_id,
            start_time_plan:data1.start_time_plan,
            subprjname:data1.subprjname,
        };
        return $http.post($rootScope.ip + '/design_institute/public/admin/SubProject/add_subproject',data, this.postCfg);
    }
    this.add_role = function (data1) {
        var data = {
            creator_id:data1.creator_id,
            end_time_plan:data1.end_time_plan,
            start_time_plan:data1.start_time_plan,
            openid:data1.openid,
            role_id:data1.roleid,
            subprj_id:data1.subprj_id,
        };
        return $http.post($rootScope.ip + '/design_institute/public/admin/Role/add_role',data, this.postCfg);
    }
    this.project_role_list = function (subproject_id) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/Role/project_role_list?subproject_id='+subproject_id);
    }
    this.del_project_role = function (data) {
        var data = {
            subproject_id:data.subproject_id,
            openid:data.openid,
        };
        return $http.post($rootScope.ip + '/design_institute/public/admin/Role/del_project_role',data,this.postCfg);
    }
    this.del_subproject = function (subproject_id) {
        var data = {}
        data.subproject_id = subproject_id;
        return $http.post($rootScope.ip + '/design_institute/public/admin/Subproject/del_subproject',data,this.postCfg);
    }
    this.del_config = function (conf_id) {
        var data = {}
        data.config_id = conf_id;
        return $http.post($rootScope.ip + '/design_institute/public/admin/Config/del_config',data,this.postCfg);
    }
});