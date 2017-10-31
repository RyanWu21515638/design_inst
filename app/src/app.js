var routerApp = angular.module('routerApp', ['ui.router', 'index', 'login', 'project', 'forum', 'user', 'newforum', 'subproject',
    'subproject_info_detail']);


/**
 *routerApp全局路由
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
routerApp
//所有页面路由
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/index');
        $stateProvider
            .state('index', {
                url: '/index',
                views: {
                    '': {
                        templateUrl: 'app/build/tpls/index/index.html'
                    },
                    'topbar@index': {
                        templateUrl: 'app/build/tpls/index/topbar.html'
                    },
                    'content@index': {
                        templateUrl: 'app/build/tpls/index/main.html'
                    }
                }
            })
            .state('index.project', {
                url: '/project',
                views: {
                    'content@index': {
                        templateUrl: 'app/build/tpls/project/project.html'
                    }
                }
            })
            .state('index.project.project_info', {
                url: '/project_info',
                templateUrl: 'app/build/tpls/project/project_info.html'

            })
            .state('index.project.configuration', {
                url: '/configuration',
                templateUrl: 'app/build/tpls/project/configuration.html'

            })
            .state('index.project.subproject', {
                url: '/subproject/:index',
                templateUrl: 'app/build/tpls/project/subproject.html'

            })
            .state('index.project.subproject_info', {
                url: '/subproject_info/:index/:subindex',
                templateUrl: 'app/build/tpls/project/subproject_info.html'

            })
            .state('index.project.subproject_info_detail', {
                url: '/subproject_info_detail/:prj_id/:subprj_id',
                templateUrl: 'app/build/tpls/project/subproject_info_detail.html'

            })


            .state('index.forum', {
                url: '/forum',
                views: {
                    'content@index': {
                        templateUrl: 'app/build/tpls/forum/forum.html'
                    }
                }
            })
            .state('index.forum.forum_items', {
                url: '/forum_items',
                templateUrl: 'app/build/tpls/forum/forum_items.html'

            })
            .state('index.forum.new_forum', {
                url: '/new_forum',
                templateUrl: 'app/build/tpls/forum/new_forum.html'

            })
            .state('index.forum.forum_detail', {
                url: '/forum_detail/:index',
                templateUrl: 'app/build/tpls/forum/forum_detail.html'

            })
            .state('index.workstation', {
                url: '/workstation',
                views: {
                    'content@index': {
                        templateUrl: 'app/build/tpls/workstation/workstation.html'
                    }
                }
            })
            .state('index.workstation.project', {
                url: '/project',
                templateUrl: 'app/build/tpls/workstation/project.html'

            })
            .state('index.workstation.newinst', {
                url: '/newinst',
                templateUrl: 'app/build/tpls/workstation/newinst.html'

            })
            .state('index.workstation.userinfo', {
                url: '/userinfo',
                templateUrl: 'app/build/tpls/workstation/userinfo.html'

            })




            //登录注册
            .state('login', {
                url: '/login',
                templateUrl: 'app/build/tpls/login/login.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'app/build/tpls/login/register.html'
            })
            .state('rstpw', {
                url: '/rstpw',
                templateUrl: 'app/build/tpls/login/resetpassword.html'
            })
            .state('upgradeUser', {
                url: '/upgradeUser',
                templateUrl: 'app/build/tpls/login/upgradeUser.html'
            })

    })
;
/**
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */

routerApp.run(function ($rootScope, $cookies) {
    $rootScope.ip = 'http://192.168.3.158';
    $rootScope.menu = false;
    //$rootScope.ip = 'http://192.168.3.168';
    //$rootScope.ip = 'http://192.168.3.7';
    //$rootScope.ip = 'http://120.25.74.178';
    //获取电脑名称
    /*function getSysInfo(){
     try{var locator = new ActiveXObject ("WbemScripting.SWbemLocator");}
     catch (e){
     alert(e);
     }
     var service = locator.ConnectServer();
     //CPU信息
     var cpu = new Enumerator (service.ExecQuery("SELECT * FROM Win32_Processor")).item();
     var cpuType=cpu.Name,hostName=cpu.SystemName;
     //内存信息
     var memory = new Enumerator (service.ExecQuery("SELECT * FROM Win32_PhysicalMemory"));
     for (var mem=[],i=0;!memory.atEnd();memory.moveNext()) mem[i++]={cap:memory.item().Capacity/1024/1024,speed:memory.item().Speed}
     //系统信息
     var system=new Enumerator (service.ExecQuery("SELECT * FROM Win32_ComputerSystem")).item();
     var physicMenCap=Math.ceil(system.TotalPhysicalMemory/1024/1024),curUser=system.UserName,cpuCount=system.NumberOfProcessors
     return {cpuType:cpuType,cpuCount:cpuCount,hostName:hostName,curUser:curUser,memCap:physicMenCap,mem:mem}
     }
     $rootScope.computer_id_noencode =(getSysInfo().curUser.split("\\")[0]);
     $rootScope.computer_id =(encodeURI(getSysInfo().curUser.split("\\")[0]));*/
    //console.log($rootScope.computer_id);
    $rootScope.computer_id = "WIN-PRMNU2HQ1CD";
})
;
