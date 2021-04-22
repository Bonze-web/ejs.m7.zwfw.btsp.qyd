/**
 * 作者：印沛锜
 * 创建时间：2020-09-05 14:27
 * 版本：[1.0, 2020-09-05]
 * 版权：江苏国泰新点软件有限公司
 * 描述：检查任务列表
 **/

(function (d, $) {
    'use strict';

    var token,
        type = '30', // tab状态
        isshowsearch = 0,
        keyword = '',
        minirefreshObj = null, // 下拉刷新实例
        tabstatus = '1', //tab状态-判断是否显示接收按钮
        tabstatus2 = '0',
        itemstatus = '0'; //事项状态-判断是否显示完成状态

    var iconstatus = '0'; //是否显示电话,导航
    var idcode = Util.getExtraDataByKey('idcode') || ''

    Util.loadJs(
        // 下拉刷新
        'js/widgets/minirefresh/minirefresh.css',
        'js/widgets/minirefresh/minirefresh.js',
        'js/widgets/minirefresh/minirefresh.bizlogic.js',
        function () {
            var className = ejs.os.android ? 'com.epoint.app.restapi.EjsApi' : 'SZEJSApi';
            var jsApiList = [{
                'moduleName': className
            }];

            Config.configReady(jsApiList, function () {

                // 初始化事件监听
                initListeners();
                // 下拉刷新
                pullToRefresh();
                //获取数量
                getCount();

            }, function (err) { });
        }
    );

	/**
	 * 初始化事件监听
	 */
    function initListeners() {
        ejs.navigator.setRightBtn({
            isShow: 1,
            imageUrl: '../common/img/default/img_search_nav_btn.png',
            which: 0,
            success: function (result) {
                // 显示搜索
                if (isshowsearch === 0) {
                    isshowsearch = 1;
                    ejs.navigator.showSearchBar({
                        success: function (result) {
                            keyword = result.keyword;
                            minirefreshObj.refresh();
                            getCount();
                        },
                        error: function (error) { }
                    });
                } else { // 隐藏按钮
                    isshowsearch = 0;
                    ejs.navigator.hideSearchBar({
                        success: function (result) { },
                        error: function (error) { }
                    });
                }
            },
            error: function (error) { }
        });

        // 头部切换
        $('#head').on('tap', '.headitem', function (e) {
            // 改变样式
            $('#head').find('.headactive').removeClass('headactive');
            $(this).addClass('headactive');

            // 刷新列表
            type = this.dataset.type;

            if (type == '30') {
                tabstatus = '1';
            } else {
                tabstatus = '0';
            }

            if (type == '50,60') {
                tabstatus = '0';
            } else {
                tabstatus2 = '0';
            }

            type == '40' ? tabstatus2 = '1' : tabstatus2 = '0';
            if (type == '40') {
                iconstatus = '1';
            } else {
                iconstatus = '0';
            }
            minirefreshObj.refresh();
            getCount();
        });

        // 待接收状态-接收
        $('#listdata').on('tap', '.btn-recive', function (e) {
            e.stopPropagation();
            var reciveguid = this.dataset.rowguid;

            ejs.ui.confirm({
                title: "提示",
                message: "确认接收吗？",
                buttonLabels: ['取消', '确定'],
                cancelable: 1,
                success: function (result) {
                    // 点击任意一个按钮都会回调
                    if (result.which == 1) {
                        reveiveTask(reciveguid);
                    }
                },
                error: function (err) { }
            });
        });

        // 进行中状态-反馈
        $('#listdata').on('tap', '.btn-feedback', function (e) {
            e.stopPropagation();
            var reciveguid = this.dataset.rowguid;

            ejs.page.open({
                pageUrl: '../inspection/inspection_detail.html',
                pageStyle: 1,
                orientation: 1,
                data: {
                    rowguid: this.dataset.rowguid
                },
                success: function (result) {
                    //获取数量
                    getCount();
                    minirefreshObj.refresh();
                },
                error: function (error) { }
            });
        });

        // 行政相对人导航
        Zepto('#listdata').on('tap', '#nav', function (e) {
            e.stopPropagation();
            console.log(this.dataset.lat);
            console.log(this.dataset.lng);
            var lat = this.dataset.lat,
                lng = this.dataset.lng,
                name = this.dataset.name;
            if (lat == '' || lng == '') {
                ejs.ui.toast('暂无定位信息');
                return;
            }

            ejs.callApi({
                // 该组件下的任意api
                name: "showNavigation",
                mudule: 'moduleName',
                // 是否长期回调，为0时可以省略
                isLongCb: 0,
                data: {
                    name: name,
                    lat: lat,
                    lng: lng
                },
                success: function (result) {

                },
                error: function (error) {
                    // 处理失败
                }
            });

        });

        // 行政相对人电话
        Zepto('.mui-content').on('tap', '#dzxdr-tel', function (e) {
            e.stopPropagation();
            var contacttel = this.dataset.tel;
            console.log(contacttel);

            if (contacttel == '') {
                ejs.ui.toast('当前行政相对人暂无电话信息');
                return;
            }

            ejs.ui.confirm({
                title: "提示",
                message: "确认拨打电话：" + contacttel,
                buttonLabels: ['取消', '确定'],
                cancelable: 1,
                success: function (result) {
                    // 点击任意一个按钮都会回调
                    console.log(result);
                    if (result.which == 1) {
                        ejs.device.callPhone(contacttel);
                    }
                },
                error: function (err) { }
            });
        });

        Zepto("body").on('tap', '.mui-table-view-cell', function (e) {
            if (e.target.tagName == 'BUTTON') { // 阻止事件冒泡
                return;
            }

            var linkurl = '';

            if (this.dataset.status == '40') { // 待反馈
                linkurl = "../inspection/inspection_detail_waitfeed.html"
                ejs.page.open({
                    pageUrl: linkurl,
                    pageStyle: 1,
                    orientation: 1,
                    data: {
                        status: this.dataset.status,
                        rowguid: this.dataset.rowguid
                    },
                    success: function (result) {
                        //获取数量
                        getCount();
                        minirefreshObj.refresh();
                    },
                    error: function (error) { }
                });
                // 暂无点击页面

            } else { // 待接收/已反馈
                linkurl = "../inspection/inspection_detail_done.html";
                ejs.page.open({
                    pageUrl: linkurl,
                    pageStyle: 1,
                    orientation: 1,
                    data: {
                        status: this.dataset.status,
                        rowguid: this.dataset.rowguid
                    },
                    success: function (result) {
                        //获取数量
                        getCount();
                        minirefreshObj.refresh();
                    },
                    error: function (error) { }
                });
            }
        })



    }

	/**
	 * @description 数据统计
	 */
    function getCount() {
        var url = Config.serverUrl + 'checkInfo/getCheckStatusCountByIdcode',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    ywcj: '1',
                    keyword: keyword,
                    idcode: idcode
                }
            });

        console.log('数据统计：', url, data);

        Util.ajax({
            url: url,
            data: data,
            contentType: 'application/json',
            beforeSend: function () {
                ejs.ui.showWaiting();
            },
            success: function (result) {
                console.log(result);
                if (result.status.code != 1) {
                    ejs.ui.toast(result.status.text);

                    return;
                }

                var data = result.custom.statuslist;

                document.getElementById('reveive-count').innerHTML = '(' + data[0].count + ')';
                // 待签收
                document.getElementById('conduct-count').innerHTML = '(' + data[1].count + ')';
                // 待反馈
                document.getElementById('finish-count').innerHTML = '(' + data[2].count + ')';
            },
            error: function (error) {
                console.log(JSON.stringify(error));
                ejs.ui.toast('接口有误，请联系管理员');
                ejs.ui.closeWaiting({});
            },
            complete: function () {
                ejs.ui.closeWaiting({});
            }
        });
    }

	/**
	 * 下拉刷新
	 * @param {String} url 接口地址
	 */
    function pullToRefresh() {

        minirefreshObj = new MiniRefreshBiz({
            url: Config.serverUrl + 'checkInfo/getCheckTaskListByIdcode',
            initPageIndex: 1,
            contentType: 'application/json',
            dataRequest: function (currPage) {
                var requestData = {
                    status: type,
                    searchkey: keyword,
                    currentpageindex: currPage.toString(),
                    pagesize: '10',
                    idcode: idcode
                };

                var data = JSON.stringify({
                    token: Config.validate,
                    params: requestData
                });

                return data;
            },
            dataChange: function (res) {
                if (res.status.code != 1) {
                    ejs.ui.toast(res.status.text);

                    return;
                }

                var list = res.custom.taskinfolist;

                list.forEach(function (item, index) {
                    item.iconstatu = iconstatus;
                    item.tabstatus = tabstatus;
                    item.itemstatus = itemstatus;
                    item.tabstatus2 = tabstatus2;
                });

                return res.custom.taskinfolist;
            },
            itemClick: function (e) {
                // e.stopPropagation();



            }
        });
    }

	/**
	 * @description 接收任务
	 */
    function reveiveTask(guid) {
        var url = Config.serverUrl + 'checkInfo/updateCheckInfo',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    dutyguid: guid,
                    status: '40',
                    addressregistered: '',
                    addressoperating: '',
                    areanumber: '',
                    entrustdept: '',
                    entrustdeptcode: '',
                    checktype: '',
                    checkmode: ''
                }
            });

        console.log('接收任务：', url, data);

        Util.ajax({
            url: url,
            data: data,
            contentType: 'application/json',
            beforeSend: function () {
                ejs.ui.showWaiting();
            },
            success: function (result) {
                console.log(result);
                if (result.status.code != 1) {
                    ejs.ui.toast(result.status.text);

                    return;
                }

                ejs.ui.toast('接收成功');

                getCount(); // 获取数量
                minirefreshObj.refresh();

            },
            error: function (error) {
                console.log(JSON.stringify(error));
                ejs.ui.toast('接口有误，请联系管理员');
                ejs.ui.closeWaiting({});
            },
            complete: function () {
                ejs.ui.closeWaiting({});
            }
        });
    }

}(document, Zepto));