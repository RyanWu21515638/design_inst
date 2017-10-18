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
        };
console.log(typeof(data));
        return $http.post($rootScope.ip + '/design_institute/public/admin/Project/add_project',data, this.postCfg);

    }


    //获取手机验证码
    this.verification_code_post = function (phone_no) {
        /*var data = {};
         data.telephone = phoneno;*/
        return $http.post($rootScope.ip + '/designPlatform/home/user/Sendmessage', phone_no, this.postCfg);
    };

    //判断手机号是否已被注册
    this.judgephone_get = function (phone_no) {
        return $http.get($rootScope.ip + '/designPlatform/home/user/verify_phone?telephone=' + phone_no);
    }

})