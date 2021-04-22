/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：预警信息
 **/

(function (d, $) {
    'use strict';

    var userGuid = '',
        minirefreshObj = null; // 下拉刷新实例

    Util.loadJs(
        // 下拉刷新
        'js/widgets/minirefresh/minirefresh.css',
        'js/widgets/minirefresh/minirefresh.js',
        'js/widgets/minirefresh/minirefresh.bizlogic.js',
        function () {
            ejs.config({
                jsApiList: []
            });

            ejs.ready(function () {
                ejs.auth.getUserInfo({
                    success: function (result) {

                        var handleUser = JSON.parse(result.userInfo);

                        userGuid = handleUser.userguid;

                        initPage()
                    },
                    error: function (error) { }
                });
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        $('#minirefresh').css('margin-top', $('.daily-tab').height() + 'px')
        // 初始化事件监听
        initListeners();
        // 下拉刷新
        pullToRefresh();
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击tab切换
            .on('tap', '.daily-tab div', function (e) {
                $('.active').removeClass('active');
                $(this).addClass('active');
                minirefreshObj.refresh();
            })
    }

    /**
     * 下拉刷新
     * @param {String} url 接口地址
     */
    function pullToRefresh() {
        minirefreshObj = new MiniRefreshBiz({
            url: Config.serverUrl + 'warning/getHandleList',
            template: '#item-template',
            initPageIndex: 0,
            listContainer: '#listdata',
            contentType: 'application/json;charset=UTF-8',
            // contentType: 'application/x-www-form-urlencoded',
            dataRequest: function (currPage) {
                var requestData = JSON.stringify({
                    token: "Epoint_WebSerivce_**##0601",
                    params: {
                        currentpage: currPage.toString(),
                        pagesize: '10',
                        type: $('.active')[0].dataset.type,
                        userguid: userGuid || '987654321123456789'
                    }
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {
                // console.log(JSON.stringify(res), res);
                // 进度低于40%，则发黄色预警 代码项2
                // 进度低于100%，则发红色预警 代码项1
                var list = res.custom.waithandlelist;
                list.map((ele, i) => {
                    ele.leave = ele.warning_level == '2' ? 'yellow' : 'red';
                })

                return res.custom.waithandlelist;
            },
            success: function (res) {

            },
            itemClick: function (e) {

                if (this.dataset.type.indexOf('风险评定') != -1) {
                    ejs.page.open('./warning_risklist.html', this.dataset);
                    return;
                }
                // 健康证是企业端的，管理端暂时不做
                // if (this.dataset.type.indexOf('健康证') != -1) {
                //     ejs.page.open('./warning_healthlist.html', this.dataset);
                //     return;
                // }
                var guid = this.dataset.guid;
                ejs.ui.confirm({
                    title: "提示",
                    message: "是否设置已读",
                    buttonLabels: ['取消', '确定'],
                    cancelable: 1,
                    h5UI: false, // 是否强制使用H5-UI效果，默认false
                    success: function (result) {
                        if (result.which == 1) {
                            setReadStatus(guid)
                        }
                    },
                    error: function (err) { }
                });


            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }

    /**
 * @description 设置已读
 */
    function setReadStatus(guid) {

        Util.ajax({
            url: Config.serverUrl + 'warning/setReadStatus',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    warnguid: guid
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                if (res.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }
                minirefreshObj.refresh();

            },
            error: function (error) {
                ejs.ui.toast(JSON.stringify(error));
                console.log(error);
                ejs.ui.closeWaiting({});
            },
            complete: function () {
                ejs.ui.closeWaiting({});
            }
        });
    }
})(document, Zepto);