login.service('requestService', function ($resource, $http, $rootScope) {
    this.postCfg = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (data) {
            return $.param(data);
        }
    };
    //获取手机验证码
    this.verification_code_post = function (phone_no) {
        /*var data = {};
         data.telephone = phoneno;*/
        return $http.post($rootScope.ip + '/designPlatform/home/user/Sendmessage', phone_no, this.postCfg);
    };

    //用户注册请求
    this.register_post = function (registerDT) {
        /*var data = {};
         data = registerDT;*/
        return $http.post($rootScope.ip + '/designPlatform/home/user/post_register', registerDT, this.postCfg);
    };

    //个人用户登录请求
    this.login_post = function (loginDT) {
        return $http.post($rootScope.ip + '/designPlatform/home/user/postLogin', loginDT, this.postCfg);
    };
    //企业erp用户登录
    this.login_company_post = function (loginDT) {
        return $http.post($rootScope.ip + "/rlerp/home/user/loginPOST", loginDT, this.postCfg)
    }
    //忘记密码
    this.forget_password_post = function (resetDT) {
        return $http.post($rootScope.ip + '/designPlatform/home/user/Forget_password', resetDT, this.postCfg);
    };
    //判断手机号是否已被注册
    this.judgephone_get = function (phone_no) {
        return $http.get($rootScope.ip + '/designPlatform/home/user/verify_phone?telephone=' + phone_no);
    }
    //判断用户名是否已存在
    this.judgename_get = function (user_name) {
        return $http.get($rootScope.ip + '/designPlatform/home/user/verify_name?user_name=' + user_name);
    }
    //升级为企业用户
    this.upgrade_company_post = function (data) {
        return $http.post($rootScope.ip + '/designPlatform/home/Company/register_Company', data, this.postCfg);
    }
})