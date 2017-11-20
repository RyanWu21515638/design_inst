var project = angular.module('project', ['ngResource', 'ngCookies']);
project.controller('projectCtrl', function ($scope, $http, $filter, $timeout, $interval, $window, $state, $cookies, $location,
                                            $rootScope, projectService) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

    var time = new Date();

    $scope.t1 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    $scope.t2 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    $scope.t3 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    $scope.t4 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    $scope.t5 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    $scope.t6 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    if ($scope.t1.month < 10)
        $scope.t1.month = "0" + $scope.t1.month;
    if ($scope.t2.month < 10)
        $scope.t2.month = "0" + $scope.t2.month;
    if ($scope.t3.month < 10)
        $scope.t3.month = "0" + $scope.t3.month;
    if ($scope.t4.month < 10)
        $scope.t4.month = "0" + $scope.t4.month;
    if ($scope.t5.month < 10)
        $scope.t5.month = "0" + $scope.t5.month;
    if ($scope.t6.month < 10)
        $scope.t6.month = "0" + $scope.t6.month;


    $scope.userinfo = {};               //用户信息
    $scope.prjinfo = {};                //创建总项目信息
    $scope.subprjinfo = {};             //创建子项目信息
    $scope.rolesinfo = {};              //子项目已分配的人员信息
    $scope.removeinfo = {};             //移除的已分配的人员信息
    $scope.downloadinfo = {};           //所有文件下载链接列表
    $scope.roles = new Array();         //给某个人员分配权限
    $rootScope.menu = false;
    $rootScope.fromIPM = $cookies.get('fromIPM');
    //获取用户微信id，公司id，设计院权限--可设置成全局变量
    //
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.headimgurl = $cookies.get('headimgurl');
    $scope.userinfo.company_name = $cookies.get('company_name');
    $scope.userinfo.nickname = $cookies.get('nickname');
    $scope.userinfo.status = $cookies.get('status');
    $scope.userinfo.currentPage = 1;
    $scope.userinfo.itemsPerPage = 10;

    $scope.paramFromIPM = $location.search();
    $cookies.put('paramFromIPM', JSON.stringify($scope.paramFromIPM), {'expires': expireDate});

    if ($location.search().login_id != undefined && $location.search().login_id != '' && $location.search().login_id != null) {

        $scope.userinfo.openid = $location.search().login_id;
        $cookies.put('fromIPM', true, {'expires': expireDate});
    }
    else {
        $scope.userinfo.openid = $cookies.get('openid');
    }
    selectUser = function (openid) {
        $http.get($rootScope.ip + "/design_institute/public/admin/user/selectUser?openid=" + openid).success(
            function (res) {
                if (res.company_id != -1 && res.company_id != '' && res.company_id != undefined && res.company_id != null) {
                    $scope.logged = 'true';
                    $cookies.put('logged', 'true', {'expires': expireDate});
                    $cookies.put('status', res.status, {'expires': expireDate});
                    $cookies.put('company_id', res.company_id, {'expires': expireDate});
                    $cookies.put('company_name', res.company_name, {'expires': expireDate});
                    $cookies.put('headimgurl', res.headimgurl, {'expires': expireDate});
                    $cookies.put('nickname', res.nickname, {'expires': expireDate});
                    $cookies.put('openid', $scope.userinfo.openid, {'expires': expireDate});
                    projectList();
                    userList();
                    $window.location.reload();
                }
            }
        )
    };
    // console.log($location.search().login_id);
    //console.log($cookies.get('openid'));

    //获取所有项目列表--包括总项目下面的子项目
    projectList = function () {
        $scope.userinfo.openid = $cookies.get('openid');
        $scope.userinfo.company_id = $cookies.get('company_id');
        $scope.userinfo.headimgurl = $cookies.get('headimgurl');
        $scope.userinfo.company_name = $cookies.get('company_name');
        $scope.userinfo.nickname = $cookies.get('nickname');
        $scope.userinfo.status = $cookies.get('status');
        $scope.userinfo.currentPage = 1;
        $scope.userinfo.itemsPerPage = 10;
        projectService.project_list($scope.userinfo).then(
            function (res) {
                $scope.prj_list = res.data;
                $rootScope.prj_list = res.data;
                var dn = new Date();
                dn = $filter('date')(dn, "yyyy-MM-dd");
                //每个项目时间节点计算
                for (var jj = 0; jj < $scope.prj_list.length; jj++) {
                    for (var jjj = 0; jjj < $scope.prj_list[jj].subproject_list.length; jjj++) {
                        var da1 = $scope.prj_list[jj].subproject_list[jjj].end_time_plan;
                        if (da1 != '' && da1 != null && da1 != undefined) {
                            var D_value = (da1.split('-')[0] - dn.split('-')[0]) * 365
                                + (da1.split('-')[1] - dn.split('-')[1]) * 30
                                + (da1.split('-')[2] - dn.split('-')[2]);
                            $scope.prj_list[jj].subproject_list[jjj]['D_value'] = D_value;
                        }
                        else
                            $scope.prj_list[jj].subproject_list[jjj]['D_value'] = 100;
                    }
                }

                //树形目录
                var json3 = [];
                $scope.treeParentId = $cookies.get('treeParentId');
                for (var ti = 0; ti < $scope.prj_list.length; ti++) {
//
                    if (ti == 0) {
                        json3.push({
                            "text": $scope.prj_list[ti].name,
                            "state": {
                                expanded: true,
                            },
                            "nodes": [],
                        });
                    }
                    else {
                        json3.push({
                            "text": $scope.prj_list[ti].name,
                            "state": {
                                checked: false,
                                disabled: false,
                                expanded: false,
                                selected: false
                            },
                            "nodes": [],
                        });
                    }
                    for (var tj = 0; tj < $scope.prj_list[ti].subproject_list.length; tj++) {
                        json3[ti].nodes.push({
                            "text": $scope.prj_list[ti].subproject_list[tj].name,
                        })
                    }
                }

                $('#treeview12').treeview({
                    "showTags": true,
                    data: json3,
                    onNodeSelected: function (event, data) {
                        if (data.parentId != undefined) {
                            var count = 0;
                            for (var cti = 0; cti < $scope.prj_list.length; cti++) {
                                for (var ctj = 0; ctj < $scope.prj_list[cti].subproject_list.length; ctj++) {
                                    count = count + 1;
                                    if (data.nodeId == count) {
                                        projectService.find_state($scope.prj_list[cti].subproject_list[ctj].subproject_id).then(
                                            function (res) {
                                                if (res.data.success == false) {
                                                    $scope.status_select = false;
                                                }
                                                else {
                                                    $scope.status_select = true;
                                                    $scope.status_list = res.data;
                                                }
                                            }
                                        )
                                        //查询选中树节点的项目进度
                                        $scope.prj_chosen = $scope.prj_list[cti];
                                        $scope.subprj_chosen = $scope.prj_list[cti].subproject_list[ctj];
                                        $scope.chosen_name = $scope.prj_list[cti].subproject_list[ctj].name;
                                        $scope.treeNodeId = data.nodeId;
                                        $scope.treeParentId = data.parentId;
                                        $cookies.put('treeParentId', $scope.treeParentId, {'expires': expireDate});
                                        $scope.prjinfo.prj_id = $scope.prj_list[cti].project_id;
                                        refresh_gantt($scope.subprj_chosen.subproject_id);
                                    }
                                }
                                count = count + 1;
                            }
                        }
                        else if (data.parentId == undefined) {

                            $('#treeview12').treeview('collapseAll', {silent: true});
                            $('#treeview12').treeview('expandNode', [data.nodeId, {levels: 2, silent: true}]);
                        }
                    }
                });

                ///////
                var sub_if_go = $location.search().subprj_id;
                if (sub_if_go) {
                    for (var i = 0; i < $scope.prj_list.length; i++) {
                        for (var j = 0; j < $scope.prj_list[i].subproject_list.length; j++)
                            if ($scope.prj_list[i].subproject_list[j].subproject_id == $location.search().subprj_id) {
                                $scope.prj_id_params = $scope.prj_list[i].project_id;

                                break;
                            }
                    }
                    for (var j = 0; j < $scope.prj_list.length; j++) {
                        if ($scope.prj_list[j].project_id == $scope.prj_id_params) {
                            $scope.prj_name = $scope.prj_list[j].name;
                            $cookies.put('prj_name', $scope.prj_name, {'expires': expireDate});
                            for (var jj = 0; jj < $scope.prj_list[j].subproject_list.length; jj++) {
                                if ($scope.prj_list[j].subproject_list[jj].subproject_id == $location.search().subprj_id) {
                                    $scope.subprj_name = $scope.prj_list[j].subproject_list[jj].name;
                                    $cookies.put('subprj_name', $scope.prj_name, {'expires': expireDate});
                                    $cookies.put('subprj_state', $scope.prj_list[j].subproject_list[jj].subproject_id, {'expires': expireDate});
                                }
                            }
                        }
                    }
                    $state.go("index.project.subproject_info_detail", {
                        prj_id: $scope.prj_id_params,
                        subprj_id: $location.search().subprj_id
                    });
                }
                ////////
            }
        )
    };


    refresh_gantt = function (subprj_id) {
        projectService.sub_gantt(subprj_id).then(
            function (res) {
                $scope.subprj_chosen.start_time_plan = res.data.start_time_plan.substring(0, 10);;
                $scope.subprj_chosen.design_start_plan = res.data.design_start_plan.substring(0, 10);;
                $scope.subprj_chosen.dwg_end_plan = res.data.dwg_end_plan.substring(0, 10);;
                $scope.subprj_chosen.end_time_plan = res.data.end_time_plan.substring(0, 10);;
                if (res.data.start_time_plan != '' && res.data.start_time_plan != null && res.data.start_time_plan != undefined) {
                    var str = res.data.start_time_plan.toString();
                    str = str.replace("/-/g", "/");
                    var t1_temp = new Date(str);
                    var gant_t1 = {};
                    gant_t1.year = t1_temp.getFullYear();
                    gant_t1.month = t1_temp.getMonth();
                    gant_t1.day = t1_temp.getDate();
                }
                if (res.data.design_start_plan != '' && res.data.design_start_plan != null && res.data.design_start_plan != undefined) {
                    var str = res.data.design_start_plan.toString();
                    str = str.replace("/-/g", "/");
                    var t2_temp = new Date(str);
                    var gant_t2 = {};
                    gant_t2.year = t2_temp.getFullYear();
                    gant_t2.month = t2_temp.getMonth();
                    gant_t2.day = t2_temp.getDate();
                }
                if (res.data.dwg_end_plan != '' && res.data.dwg_end_plan != null && res.data.dwg_end_plan != undefined) {
                    var str = res.data.dwg_end_plan.toString();
                    str = str.replace("/-/g", "/");
                    var t3_temp = new Date(str);
                    var gant_t3 = {};
                    gant_t3.year = t3_temp.getFullYear();
                    gant_t3.month = t3_temp.getMonth();
                    gant_t3.day = t3_temp.getDate();
                }
                if (res.data.end_time_plan != '' && res.data.end_time_plan != null && res.data.end_time_plan != undefined) {
                    var str = res.data.end_time_plan.toString();
                    str = str.replace("/-/g", "/");
                    var t4_temp = new Date(str);
                    var gant_t4 = {};
                    gant_t4.year = t4_temp.getFullYear();
                    gant_t4.month = t4_temp.getMonth();
                    gant_t4.day = t4_temp.getDate();
                }
                var data = [];
                //底图接单--底图完成
                data.push(
                    {
                        x: Date.UTC(gant_t1.year, gant_t1.month, gant_t1.day),
                        x2: Date.UTC(gant_t3.year, gant_t3.month, gant_t3.day),
                        y: 0,
                        partialFill: res.data.count_finished_dwg / res.data.count_sum_dwg
                    }
                );
                //底图确认--设计完成
                data.push(
                    {
                        x: Date.UTC(gant_t2.year, gant_t2.month, gant_t2.day),
                        x2: Date.UTC(gant_t4.year, gant_t4.month, gant_t4.day),
                        y: 1,
                        partialFill: res.data.count_finished_design / res.data.count_sum_design
                    }
                );

                Highcharts.chart('container', {
                    chart: {
                        type: 'xrange'
                    },
                    title: {
                        text: '项目进度表'
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            week: '%Y/%m/%d'
                        }
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        categories: ['底图', '设计'],
                        reversed: true
                    },
                    tooltip: {
                        dateTimeLabelFormats: {
                            day: '%Y/%m/%d'
                        }
                    },
                    series: [{
                        name: $scope.chosen_name,
                        //pointPadding: 0,
                        //groupPadding: 0,
                        borderColor: 'black',
                        pointWidth: 20,
                        data: data,
                        /*data: [{
                            x: Date.UTC(2014, 10, 21),
                            x2: Date.UTC(2014, 11, 2),
                            y: 0,
                            partialFill: 0.25
                        }, {
                            x: Date.UTC(2014, 11, 2),
                            x2: Date.UTC(2014, 11, 5),
                            y: 1,
                            partialFill: 0.25
                        }, {
                            x: Date.UTC(2014, 11, 8),
                            x2: Date.UTC(2014, 11, 9),
                            y: 2
                        }, {
                            x: Date.UTC(2014, 11, 9),
                            x2: Date.UTC(2014, 11, 19),
                            y: 1
                        }, {
                            x: Date.UTC(2014, 11, 10),
                            x2: Date.UTC(2014, 11, 23),
                            y: 2,
                            partialFill: 0.25
                        }],*/
                        dataLabels: {
                            enabled: true
                        }
                    }]
                });
            }
        )

    }
    //获取所有设计院用户
    userList = function () {
        projectService.user_list($scope.userinfo).then(
            function (res) {
                $scope.usr_list = res.data;
                for (var i = 0; i < $scope.usr_list.length; i++) {
                    $scope.usr_list[i]['show'] = true;
                    $scope.usr_list[i]['check'] = new Array();
                    $scope.usr_list[i]['check'][0] = false;
                    $scope.usr_list[i]['check'][1] = false;
                    $scope.usr_list[i]['check'][2] = false;
                    $scope.usr_list[i]['check'][3] = false;
                    $scope.usr_list[i]['check'][4] = false;
                    $scope.usr_list[i]['check'][3] = false;
                    $scope.usr_list[i]['check'][4] = false;
                }

            }
        )
    };
    if ($cookies.get('openid') == undefined || $cookies.get('openid') == '' || $cookies.get('openid') == null ||
        ($cookies.get('openid') != $location.search().login_id && $location.search().login_id != undefined)) {
        selectUser($scope.userinfo.openid);
    }
    else {
        projectList();
        userList();
    }

    //获取公司配置列表
    $scope.configurationlist = function () {
        projectService.configuration_list($scope.userinfo).then(
            function (res) {
                $scope.conf_list = res.data;
            }
        )
    };
    //获取公司权限列表
    $scope.grouplist = function () {
        projectService.group_list().then(
            function (res) {
                $scope.grp_list = res.data;
                $cookies.put('grp_list', JSON.stringify($scope.grp_list), {'expires': expireDate});
            }
        )
    }
    //选定总项目
    $scope.prj_dt = function (prjid, media) {
        //选定总项目
        for (var i = 0; i < $scope.prj_list.length; i++) {
            if ($scope.prj_list[i].project_id == prjid) {
                $scope.index = i;
                break;
            }
        }

        $scope.prjinfo.prj_id = prjid;
        //移动端
        if (media == 2) {
            $state.go("index.project.subproject", {index: $scope.index});
        }
    }

    //新建总项目
    $scope.newprj = function () {
        $scope.prjinfo.company_id = $cookies.get('company_id');
        $scope.prjinfo.creator_id = $cookies.get('openid');
        $scope.prjinfo.start_time_plan = $scope.t1.year + '-' + $scope.t1.month + '-' + $scope.t1.day;
        $scope.prjinfo.design_start_plan = $scope.t2.year + '-' + $scope.t2.month + '-' + $scope.t2.day;

        var time_2 = new Date($scope.t2.year, $scope.t2.month, 0);
        if (($scope.t2.day + 12) > time_2.getDate()) {
            $scope.prjinfo.end_time_plan = $scope.t2.year + '-' + ($scope.t2.month + 1) + '-' + (($scope.t2.day + 12) - time_2.getDate());
        }
        else {
            $scope.prjinfo.end_time_plan = $scope.t2.year + '-' + $scope.t2.month + '-' + ($scope.t2.day + 12);
        }

        if (($scope.t1.day + 7) > time_2.getDate()) {
            $scope.prjinfo.dwg_end_plan = $scope.t1.year + '-' + ($scope.t1.month + 1) + '-' + (($scope.t1.day + 7) - time_2.getDate());
        }
        {
            $scope.prjinfo.dwg_end_plan = $scope.t1.year + '-' + $scope.t1.month + '-' + ($scope.t1.day + 7);
        }

        projectService.new_project($scope.prjinfo).then(
            function (res) {
                if (res.data.success) {
                    alert("总项目创建成功");
                    $('#modal-form1').modal('hide');
                    projectList();
                }
            }
        )
    };
    //删除总项目
    $scope.delProject = function (prj_id, prj_name, type) {
        $scope.delete_type = 1;
        if (type == 1) {
            $scope.delete_prj_id = prj_id;
            $scope.delete_prj_name = prj_name;
        }
        else if (type == 2) {
            projectService.del_project($scope.delete_prj_id).then(
                function (res) {
                    if (res.data.success == false || res.data.success == '' || res.data.success == null || res.data.success == undefined) {
                        alert("正在进行的项目无法删除！");
                    }
                    else {
                        alert("项目删除成功！");
                        $('#modal-delete').modal('hide');
                        projectList();
                    }

                }
            )
        }
    }
    //新建子项目

    $scope.newsubprj = function () {
        $scope.subprjinfo.prj_id = $scope.prjinfo.prj_id;
        $scope.subprjinfo.company_id = $cookies.get('company_id');
        $scope.subprjinfo.creator_id = $cookies.get('openid');
        $scope.subprjinfo.start_time_plan = $scope.t5.year + '-' + $scope.t5.month + '-' + $scope.t5.day;
        $scope.subprjinfo.design_start_plan = $scope.t6.year + '-' + $scope.t6.month + '-' + $scope.t6.day;

        var time_1 = new Date($scope.t6.year, $scope.t6.month, 0);
        if (($scope.t6.day + 12) > time_1.getDate()) {
            $scope.subprjinfo.end_time_plan = $scope.t6.year + '-' + ($scope.t6.month + 1) + '-' + (($scope.t6.day + 12) - time_1.getDate());
        }
        else {
            $scope.subprjinfo.end_time_plan = $scope.t6.year + '-' + $scope.t6.month + '-' + ($scope.t6.day + 12);
        }

        if (($scope.t5.day + 7) > time_1.getDate()) {
            $scope.subprjinfo.dwg_end_plan = $scope.t5.year + '-' + ($scope.t5.month + 1) + '-' + (($scope.t5.day + 7) - time_1.getDate());
        }
        {
            $scope.subprjinfo.dwg_end_plan = $scope.t5.year + '-' + $scope.t5.month + '-' + ($scope.t5.day + 7);
        }

        projectService.new_subproject($scope.subprjinfo).then(
            function (res) {
                if (res.data.success) {
                    alert("子项目创建成功");
                    $('#modal-form2').modal('hide');
                    projectList();
                }
            }
        )
    };
    //选定子项目
    $scope.subchose = function (prjid, state) {
        $cookies.put('subprj_state', state, {'expires': expireDate});

        for (var i = 0; i < $scope.usr_list.length; i++) {
            $scope.usr_list[i]['show'] = true;
            $scope.usr_list[i]['check'] = new Array();
            $scope.usr_list[i]['check'][0] = false;
            $scope.usr_list[i]['check'][1] = false;
            $scope.usr_list[i]['check'][2] = false;
            $scope.usr_list[i]['check'][3] = false;
            $scope.usr_list[i]['check'][4] = false;
        }
        $scope.rolesinfo.subprj_id = prjid;

        projectService.project_role_list($scope.rolesinfo.subprj_id).then(
            function (res) {
                $scope.prj_role_list = res.data;
                $rootScope.prj_role_list = res.data;
                var ifexist = false;
                for (var i = 0; i < $scope.usr_list.length; i++) {
                    for (var j = 0; j < $scope.prj_role_list.length; j++) {
                        if ($scope.usr_list[i].openid == $scope.prj_role_list[j].openid) {
                            ifexist = true;
                        }
                    }
                    if (ifexist) {
                        $scope.usr_list[i]['show'] = false;
                        ifexist = false;
                    }
                }
            }
        )
    }
    //
    $scope.set_prj_suprj_name = function (subprj_id) {
        for (var j = 0; j < $scope.prj_list.length; j++) {
            if ($scope.prj_list[j].project_id == $scope.prjinfo.prj_id) {
                $scope.prj_name = $scope.prj_list[j].name;
                $cookies.put('prj_name', $scope.prj_name, {'expires': expireDate});
                for (var jj = 0; jj < $scope.prj_list[j].subproject_list.length; jj++) {
                    if ($scope.prj_list[j].subproject_list[jj].subproject_id == subprj_id) {
                        $scope.subprj_name = $scope.prj_list[j].subproject_list[jj].name;
                        $cookies.put('subprj_name', $scope.prj_name, {'expires': expireDate});
                    }
                }
            }
        }
    }
    //
    $scope.downloadList = function (subproject_id) {
        $scope.downloadinfo.company_id = $cookies.get('company_id');
        $scope.downloadinfo.project_id = $scope.prjinfo.prj_id;
        $scope.downloadinfo.subproject_id = subproject_id;
        projectService.download_list($scope.downloadinfo).then(
            function (res) {
                $scope.dl_list = res.data;
            }
        )
    }
    //选定已设置权限的人员添加到项目中
    $scope.hide = function (index) {
        $scope.roles.length = 0;
        if (!$scope.usr_list[index]['check'][0] && !$scope.usr_list[index]['check'][1]
            && !$scope.usr_list[index]['check'][2] && !$scope.usr_list[index]['check'][3]
            && !$scope.usr_list[index]['check'][4] && !$scope.usr_list[index]['check'][5]
            && !$scope.usr_list[index]['check'][6]
        ) alert("必须指定一个角色权限！");
        else {
            $scope.usr_list[index]['show'] = false;
            if ($scope.usr_list[index]['check'][0] == true) {
                $scope.roles.push(1);
            }
            if ($scope.usr_list[index]['check'][1] == true) {
                $scope.roles.push(2);
            }
            if ($scope.usr_list[index]['check'][2] == true) {
                $scope.roles.push(3);
            }
            if ($scope.usr_list[index]['check'][3] == true) {
                $scope.roles.push(4);
            }
            if ($scope.usr_list[index]['check'][4] == true) {
                $scope.roles.push(5);
            }
            if ($scope.usr_list[index]['check'][5] == true) {
                $scope.roles.push(6);
            }
            if ($scope.usr_list[index]['check'][6] == true) {
                $scope.roles.push(7);
            }
            $scope.rolesinfo.company_id = $cookies.get('company_id');
            $scope.rolesinfo.creator_id = $cookies.get('openid');
            $scope.rolesinfo.start_time_plan = $scope.t3.year + '-' + $scope.t3.month + '-' + $scope.t3.day;
            $scope.rolesinfo.end_time_plan = $scope.t4.year + '-' + $scope.t4.month + '-' + $scope.t4.day;
            $scope.rolesinfo.openid = $scope.usr_list[index].openid;
            $scope.rolesinfo.roleid = $scope.roles;
            projectService.add_role($scope.rolesinfo).then(
                function (res) {
                    if (res.data.success) {
                        $scope.subchose($scope.rolesinfo.subprj_id);
                    }
                }
            )
        }

    }
    $scope.peopleDetail = function (index, nickname, headimgurl) {
        $scope.people_detail_index = index;
        $scope.people_detail_name = nickname;
        $scope.people_detail_headimgurl = headimgurl;
    }
    //从已分配人员中删除
    $scope.remove = function (openid) {
        $scope.removeinfo.openid = openid;
        $scope.removeinfo.subproject_id = $scope.rolesinfo.subprj_id;
        projectService.del_project_role($scope.removeinfo).then(
            function (res) {
                if (res.data.success) {
                    $scope.subchose($scope.rolesinfo.subprj_id);
                }
            }
        )
    }
    //删除子项目
    $scope.delSubproject = function (subprj_id, subprj_name, type) {
        $scope.delete_type = 2;
        if (type == 1) {
            $scope.delete_subprj_id = subprj_id;
            $scope.delete_subprj_name = subprj_name;
        }
        else if (type == 2) {
            projectService.del_subproject($scope.delete_subprj_id).then(
                function (res) {
                    if (!res.data.success) {
                        alert("项目进行中，无法删除！");
                    }
                    else {
                        alert("项目删除成功！");
                        $('#modal-delete').modal('hide');

                        projectList();
                    }
                }
            )
        }

    }
    //highchars 图表

    //时间选择器1
    $("#timepicker1").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t1.year = ev.date.getFullYear();
        $scope.t1.month = ev.date.getMonth() + 1;
        $scope.t1.day = ev.date.getDate();
    }).on("hide", function () {
        $("#timepicker1").blur();
    });
    //时间选择器2
    $("#timepicker2").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t2.year = ev.date.getFullYear();
        $scope.t2.month = ev.date.getMonth() + 1;
        $scope.t2.day = ev.date.getDate();
    }).on("hide", function () {
        $("#timepicker2").blur();
    });
    //时间选择器3
    $("#timepicker3").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t3.year = ev.date.getFullYear();
        $scope.t3.month = ev.date.getMonth() + 1;
        $scope.t3.day = ev.date.getDate();
        console.log($scope.t3);
    }).on("hide", function () {
        $("#timepicker3").blur();
    });

    //时间选择器3
    $("#timepicker4").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t4.year = ev.date.getFullYear();
        $scope.t4.month = ev.date.getMonth() + 1;
        $scope.t4.day = ev.date.getDate();
        if ($scope.project_id) {
            //$scope.changecharts($scope.project_id, $scope.t.year + '-' + $scope.t1.month, $scope.t2.year + '-' + $scope.t2.month);
        }
    }).on("hide", function () {
        $("#timepicker4").blur();
    });
    //时间选择器4
    $("#timepicker5").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t5.year = ev.date.getFullYear();
        $scope.t5.month = ev.date.getMonth() + 1;
        $scope.t5.day = ev.date.getDate();
        if ($scope.project_id) {
            //$scope.changecharts($scope.project_id, $scope.t.year + '-' + $scope.t1.month, $scope.t2.year + '-' + $scope.t2.month);
        }
    }).on("hide", function () {
        $("#timepicker5").blur();
    });
    //时间选择器5
    $("#timepicker6").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t6.year = ev.date.getFullYear();
        $scope.t6.month = ev.date.getMonth() + 1;
        $scope.t6.day = ev.date.getDate();
        if ($scope.project_id) {
            //$scope.changecharts($scope.project_id, $scope.t.year + '-' + $scope.t1.month, $scope.t2.year + '-' + $scope.t2.month);
        }
    }).on("hide", function () {
        $("#timepicker6").blur();
    });

    getData = function () {
        $scope.userinfo.itemsPerPage = $scope.userinfo.itemsPerPage + 10;
        projectList();
    }


    $scope.scrollT_old = 0;
    //定义鼠标滚动事件
    $("#prj_tab").scroll(
        function () {
            var h = $(this).height();//div可视区域的高度
            var sh = $(this)[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
            var st = $(this)[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离
            console.log(h + '-' + sh + '-' + st);
            if ((sh - h) == st) {
                getData();
            }
        }
    );
    //继续加载按钮事件
    $("#btn_Page").click(function () {
        getData();
    });

    $scope.alterTime = function (prj_id, subprj_id, type, time_compare) {
        if ($scope.userinfo.status != 2) {
            alert('无修改权限！');
        }
        else {
            $scope.alter_time_info = {
                prj_id: prj_id,
                subprj_id: subprj_id,
                type: type,
                time_compare: time_compare //type为1：存的是计划结束时间；2：存的计划开始时间
            }
            $('#modal-alterTime').modal('show');
        }
    }
    $scope.saveAlterTime = function () {
        $scope.alter_time_info.time_var = $scope.t3.year + '-' + $scope.t3.month + '-' + $scope.t3.day;
        if ($scope.alter_time_info.type == 1 ||$scope.alter_time_info.type == 3) {
            if ((Date.parse(new Date($scope.alter_time_info.time_var)) / 1000) > (Date.parse(new Date($scope.alter_time_info.time_compare)) / 1000))
                alert('开始时间不能晚于截止时间！');
            else {
                projectService.alter_time($scope.alter_time_info).then(
                    function (res) {
                        if (!res.data.success) {
                            alert("无变更!");
                        } else {
                            alert("修改成功！");
                            projectList();
                            refresh_gantt($scope.alter_time_info.subprj_id);
                        }
                    }
                )
            }
        }
        if ($scope.alter_time_info.type == 2 || $scope.alter_time_info.type == 4) {
            if ((Date.parse(new Date($scope.alter_time_info.time_var)) / 1000) < (Date.parse(new Date($scope.alter_time_info.time_compare)) / 1000))
                alert('截止时间不能早于开始时间！');
            else {
                projectService.alter_time($scope.alter_time_info).then(
                    function (res) {
                        if (!res.data.success) {
                            alert("无变更!");
                        } else {
                            alert("修改成功！");
                            projectList();
                            refresh_gantt($scope.alter_time_info.subprj_id);
                        }
                    }
                )
            }
        }
    };


})
