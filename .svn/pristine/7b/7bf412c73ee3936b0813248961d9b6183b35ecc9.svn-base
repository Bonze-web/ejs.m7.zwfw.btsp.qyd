/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：我的收藏
 **/

(function (d, $) {
    'use strict';

    var minirefreshObj = null; // 下拉刷新实例

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
                initPage()
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
            // 点击取消收藏 跳转url
            .on('tap', '#listdata li', function (e) {
                var target = e.detail.target;
                console.log(target.className)
                if (target.className == 'esccollection') {
                    var guid = this.dataset.guid;
                    ejs.ui.confirm({
                        title: "提示",
                        message: "是否确定取消收藏",
                        buttonLabels: ['取消', '确定'],
                        cancelable: 1,
                        h5UI: false, // 是否强制使用H5-UI效果，默认false
                        success: function (result) {
                            if (result.which == 1) {
                                deleteCollection(guid, $(this))
                            }
                        },
                        error: function (err) { }
                    });
                    return;
                }
                ejs.page.open(this.dataset.url);
            })
    }
    /**
     * @description 删除收藏
     */
    function deleteCollection(guid, _this) {
        Util.ajax({
            url: Config.serverUrl + 'btjgxx/deleteCollection',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    collectionguid: guid
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
                ejs.ui.toast('删除成功');
                _this.remove();
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

    /**
     * 下拉刷新
     * @param {String} url 接口地址
     */
    function pullToRefresh() {
        minirefreshObj = new MiniRefreshBiz({
            url: Config.serverUrl + 'btjgxx/getCollectionList',
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
                        clienttype: $('.active')[0].dataset.type,
                        loginid: 'admin'
                    }
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {


                return res.custom.collectionList;
            },
            success: function (res) {
            },
            itemClick: function (e) {

            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }
})(document, Zepto);