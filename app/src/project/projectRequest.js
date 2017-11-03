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
        return $http.get($rootScope.ip + '/design_institute/public/admin/Project/project_list?openid=' + data.openid + '&company_id=' + data.company_id);
    }
    this.user_list = function (data) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/User/Userlist?company_id=' + data.company_id + '&status=' + data.status);
    }
    this.configuration_list = function (data) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/Config/Config_list?company_id=' + data.company_id)
    }
    this.group_list = function () {
        return $http.get($rootScope.ip + '/design_institute/public/admin/Role/select_role')
    }
    //新建总项目
    this.new_project = function (data1) {
        var data = {
            company_id: data1.company_id,
            config_id: data1.config_id,
            creator_id: data1.creator_id,
            end_time_plan: data1.end_time_plan,
            openid: data1.openid,
            prjname: data1.prjname,
            role_id: data1.role_id,
            start_time_plan: data1.start_time_plan,
            create_sub: data1.create_sub,
        };
        return $http.post($rootScope.ip + '/design_institute/public/admin/Project/add_project', data, this.postCfg);
    }
    //删除总项目
    this.del_project = function (prj_id) {
        var data = {
            project_id:prj_id
        }
        return $http.post($rootScope.ip + '/design_institute/public/admin/Project/del_project', data, this.postCfg);

    }
    //新建子项目
    this.new_subproject = function (data1) {
        var data = {
            company_id: data1.company_id,
            prj_id: data1.prj_id,
            creator_id: data1.creator_id,
            end_time_plan: data1.end_time_plan,
            openid: data1.openid,
            prjname: data1.prjname,
            role_id: data1.role_id,
            start_time_plan: data1.start_time_plan,
            subprjname: data1.subprjname,
        };
        return $http.post($rootScope.ip + '/design_institute/public/admin/SubProject/add_subproject', data, this.postCfg);
    }
    //添加角色
    this.add_role = function (data1) {
        var data = {
            creator_id: data1.creator_id,
            end_time_plan: data1.end_time_plan,
            start_time_plan: data1.start_time_plan,
            openid: data1.openid,
            role_id: data1.roleid,
            subprj_id: data1.subprj_id,
        };
        return $http.post($rootScope.ip + '/design_institute/public/admin/Role/add_role', data, this.postCfg);
    }
    //查询子项目已分配的人员
    this.project_role_list = function (subproject_id) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/Role/project_role_list?subproject_id=' + subproject_id);
    }
    //移除已分配的人员
    this.del_project_role = function (data1) {
        var data = {
            subproject_id: data1.subproject_id,
            openid: data1.openid,
        };
        return $http.post($rootScope.ip + '/design_institute/public/admin/Role/del_project_role', data, this.postCfg);
    }
    //删除子项目
    this.del_subproject = function (subproject_id) {
        var data = {}
        data.subproject_id = subproject_id;
        return $http.post($rootScope.ip + '/design_institute/public/admin/Subproject/del_subproject', data, this.postCfg);
    }
    //删除配置文件
    this.del_config = function (conf_id) {
        var data = {}
        data.config_id = conf_id;
        return $http.post($rootScope.ip + '/design_institute/public/admin/Config/del_config', data, this.postCfg);
    }
    //文件下载列表
    this.download_list = function (data) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/Project/Download_list?company_id=' + data.company_id + '&project_id=' + data.project_id
            + '&subproject_id=' + data.subproject_id);
    }

    //获取总任务列表
    this.taskgroup_task_list = function (data) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/Taskgroup/taskgroup_task_list',
            {params: data}
        );
    }
    //新增任务列表
    this.add_taskgroup = function (data1) {
        var data = {
            subprj_id: data1.subprj_id,
            openid: data1.openid,
            task_group_name: data1.task_group_name,
            role_id: data1.role_id,
        }
        return $http.post($rootScope.ip + '/design_institute/public/admin/Taskgroup/add_taskgroup', data, this.postCfg);
    }
    //删除任务列表
    this.del_taskgroup = function (data1) {
        var data = {
            taskgroup_id :data1
        }
        return $http.post($rootScope.ip + '/design_institute/public/admin/Taskgroup/del_taskgroup', data, this.postCfg);
    }
    //新增子任务
    this.add_task = function (data1) {
        var data = {
            subtask_id:data1.subtask_id,
            creator_id: data1.creator_id,
            taskgroup_id: data1.taskgroup_id,
            changer_id: data1.changer_id,
            parter: data1.parter,
            subtask_name: data1.subtask_name,
            remarks: data1.remarks,
            end_time_plan: data1.end_time_plan,
            urgent:data1.urgent,
        }
        return $http.post($rootScope.ip + '/design_institute/public/admin/Task/add_task', data, this.postCfg);
    }
    //删除子任务
    this.del_task = function (data1) {
        var data ={
            task_id:data1
        }
        return $http.post($rootScope.ip + '/design_institute/public/admin/Task/del_task', data, this.postCfg);

    }
    //子任务任务轨迹
    this.get_project_tasktrailinfos = function (data1) {

        var data={
            task_id:data1.subtask_id
        }
        return $http.get($rootScope.ip + '/design_institute/public/home/Projecttask/getProjecttasktrailinfos',
            {params: (data)}
            );

    }

    //子任务看板
    this.month_task_list =function (subprj_id) {
        return $http.get($rootScope.ip + '/design_institute/public/admin/Task/month_task_list?subprj_id='+subprj_id);

    }

});