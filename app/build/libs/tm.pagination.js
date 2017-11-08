/**
 * name: tm.pagination
 * Version: 1.0.0 beta
 */
angular.module('tm.pagination', []).directive('tmPagination',[function(){
    return {
        restrict: 'EA',
        template: '<div class="page-list">' +
            '<ul class="pagination" ng-show="conff.totalItems > 0">' +
            '<li ng-class="{disabled: conff.currentPage == 1}" ng-click="prevPage()"><span>&laquo;</span></li>' +
            '<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conff.currentPage, separate: item == \'...\'}" ' +
            'ng-click="changeCurrentPage(item)">' +
            '<span>{{ item }}</span>' +
            '</li>' +
            '<li ng-class="{disabled: conff.currentPage == conff.numberOfPages}" ng-click="nextPage()"><span>&raquo;</span></li>' +
            '</ul>' +
            '<div class="page-total" ng-show="conff.totalItems > 0">' +
            '每页<select ng-model="conff.itemsPerPage" ng-options="option for option in conff.perPageOptions " ng-change="changeItemsPerPage()"></select>' +
            '/共<strong>{{ conff.totalItems }}</strong>条 ' +
            '跳转至<input type="text" ng-model="jumpPageNum" ng-keyup="jumpPageKeyUp($event)"/>' +
            '</div>' +
            '<div class="no-items" ng-show="conff.totalItems <= 0">暂无数据</div>' +
            '</div>',
        replace: true,
        scope: {
            conff: '='
        },
        link: function(scope, element, attrs) {
            
            var conff = scope.conff;

            // 默认分页长度
            var defaultPagesLength = 9;

            // 默认分页选项可调整每页显示的条数
            var defaultPerPageOptions = [10, 15, 20, 30, 50];

            // 默认每页的个数
            var defaultPerPage = 15;

            // 获取分页长度
            if(conff.pagesLength) {
                // 判断一下分页长度
                conff.pagesLength = parseInt(conff.pagesLength, 10);

                if(!conff.pagesLength) {
                    conff.pagesLength = defaultPagesLength;
                }

                // 分页长度必须为奇数，如果传偶数时，自动处理
                if(conff.pagesLength % 2 === 0) {
                    conff.pagesLength += 1;
                }

            } else {
                conff.pagesLength = defaultPagesLength
            }

            // 分页选项可调整每页显示的条数
            if(!conff.perPageOptions){
                conff.perPageOptions = defaultPagesLength;
            }

            // pageList数组
            function getPagination(newValue, oldValue) {
                
                // conf.currentPage
                if(conff.currentPage) {
                    conff.currentPage = parseInt(scope.conff.currentPage, 10);
                }

                if(!conff.currentPage) {
                    conff.currentPage = 1;
                }

                // conf.totalItems
                if(conff.totalItems) {
                    conff.totalItems = parseInt(conff.totalItems, 10);
                }

                // conf.totalItems
                if(!conff.totalItems) {
                    conff.totalItems = 0;
                    return;
                }
                
                // conf.itemsPerPage 
                if(conff.itemsPerPage) {
                    conff.itemsPerPage = parseInt(conff.itemsPerPage, 10);
                }
                if(!conff.itemsPerPage) {
                    conff.itemsPerPage = defaultPerPage;
                }

                // numberOfPages
                conff.numberOfPages = Math.ceil(conff.totalItems/conff.itemsPerPage);

                // 如果分页总数>0，并且当前页大于分页总数
                if(scope.conff.numberOfPages > 0 && scope.conff.currentPage > scope.conff.numberOfPages){
                    scope.conff.currentPage = scope.conff.numberOfPages;
                }

                // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                var perPageOptionsLength = scope.conff.perPageOptions.length;

                // 定义状态
                var perPageOptionsStatus;
                for(var i = 0; i < perPageOptionsLength; i++){
                    if(conff.perPageOptions[i] == conff.itemsPerPage){
                        perPageOptionsStatus = true;
                    }
                }
                // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                if(!perPageOptionsStatus){
                    conff.perPageOptions.push(conff.itemsPerPage);
                }

                // 对选项进行sort
                conff.perPageOptions.sort(function(a, b) {return a - b});
                

                // 页码相关
                scope.pageList = [];
                if(conff.numberOfPages <= conff.pagesLength){
                    // 判断总页数如果小于等于分页的长度，若小于则直接显示
                    for(i =1; i <= conff.numberOfPages; i++){
                        scope.pageList.push(i);
                    }
                }else{
                    // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                    // 计算中心偏移量
                    var offset = (conff.pagesLength - 1) / 2;
                    if(conff.currentPage <= offset){
                        // 左边没有...
                        for(i = 1; i <= offset + 1; i++){
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(conff.numberOfPages);
                    }else if(conff.currentPage > conff.numberOfPages - offset){
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for(i = offset + 1; i >= 1; i--){
                            scope.pageList.push(conff.numberOfPages - i);
                        }
                        scope.pageList.push(conff.numberOfPages);
                    }else{
                        // 最后一种情况，两边都有...
                        scope.pageList.push(1);
                        scope.pageList.push('...');

                        for(i = Math.ceil(offset / 2) ; i >= 1; i--){
                            scope.pageList.push(conff.currentPage - i);
                        }
                        scope.pageList.push(conff.currentPage);
                        for(i = 1; i <= offset / 2; i++){
                            scope.pageList.push(conff.currentPage + i);
                        }

                        scope.pageList.push('...');
                        scope.pageList.push(conff.numberOfPages);
                    }
                }

                scope.$parent.conff = conff;
            }

            // prevPage
            scope.prevPage = function() {
                if(conff.currentPage > 1){
                    conff.currentPage -= 1;
                }
            };

            // nextPage
            scope.nextPage = function() {
                if(conff.currentPage < conff.numberOfPages){
                    conff.currentPage += 1;
                }
            };

            // 变更当前页
            scope.changeCurrentPage = function(item) {
                
                if(item == '...'){
                    return;
                }else{
                    conff.currentPage = item;
                    getPagination();
                    // conf.onChange()函数
                    if(conff.onChange) {
                        conff.onChange();
                    }
                }
            };

            // 修改每页展示的条数
            scope.changeItemsPerPage = function() {

                // 一发展示条数变更，当前页将重置为1
                conff.currentPage = 1;

                getPagination();
                // conf.onChange()函数
                if(conff.onChange) {
                    conff.onChange();
                }
            };

            // 跳转页
            scope.jumpToPage = function() {
                num = scope.jumpPageNum;
                if(num.match(/\d+/)) {
                    num = parseInt(num, 10);
                
                    if(num && num != conff.currentPage) {
                        if(num > conff.numberOfPages) {
                            num = conff.numberOfPages;
                        }

                        // 跳转
                        conff.currentPage = num;
                        getPagination();
                        // conf.onChange()函数
                        if(conff.onChange) {
                            conff.onChange();
                        }
                        scope.jumpPageNum = '';
                    }
                }
                
            };

            scope.jumpPageKeyUp = function(e) {
                var keycode = window.event ? e.keyCode :e.which;
                
                if(keycode == 13) {
                    scope.jumpToPage();
                }
            }

            scope.$watch('conff.totalItems', function(value, oldValue) {
                
                // 在无值或值相等的时候，去执行onChange事件
                if(!value || value == oldValue) {
                    
                    if(conff.onChange) {
                        conff.onChange();
                    }
                }
                getPagination();
            })
            
        }
    };
}]);