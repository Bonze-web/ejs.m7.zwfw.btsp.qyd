/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：风险分级评定反馈
 **/

(function (d, $) {
    'use strict';

    var userguid = Util.getExtraDataByKey('userguid') || '',
        dutyguid = Util.getExtraDataByKey('dutyguid') || '',
        optguid = Util.getExtraDataByKey('optguid') || '',
        opttype = Util.getExtraDataByKey('opttype') || '',
        optname = Util.getExtraDataByKey('optname') || '',
        status = Util.getExtraDataByKey('status') || '',
        urlajax = Util.getExtraDataByKey('urlajax') || '',
        minirefreshObj = null; // 下拉刷新实例

    // optguid = '31189329-3674-45d0-8144-ezd93d0350';
    // opttype = 'pdt'

    Util.loadJs(
        // 下拉刷新
        'js/widgets/minirefresh/minirefresh.css',
        'js/widgets/minirefresh/minirefresh.js',
        // 'js/widgets/minirefresh/themes/native/minirefresh.theme.native.js',
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

        // 初始化事件监听
        initListeners();

        if (urlajax) {//查看动态
            $('.feed-title,.addcheck,#minirefresh,.base-btn').addClass('hidden');
            getDynamicScoreList(urlajax);
            ejs.navigator.setTitle('动态风险因素量化得分');
            return
        }
        $('.feed-title,.addcheck,#minirefresh,.base-btn').removeClass('hidden');
        getSaveCheckResult();
        pullToRefresh();

        $('#minirefresh').css('margin-top', $('.feed-title').height() + $('.addcheck').height() + $('#checktitle').height() + 20 + 'px')

    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击添加
            .on('tap', '.addcheck', function (e) {
                // ejs.page.open('./risk_feedbackaddcheck.html', { dutyguid: dutyguid, optguid: optguid, optname: optname })
                ejs.page.open({
                    pageUrl: './risk_feedbackaddcheck.html',
                    pageStyle: 1,
                    orientation: 1,
                    data: {
                        dutyguid: dutyguid, optguid: optguid, optname: optname
                    },
                    success: function (result) {
                        getSaveCheckResult();
                        minirefreshObj.refresh();
                    },
                    error: function (error) { }
                });
            })
            // 点击底部按钮
            .on('tap', '#base-btn div', function (e) {
                if ($(this).text() == '提交审核') {
                    updateTask('40');
                    return;
                }
                ejs.ui.alert({
                    title: "提示",
                    message: "保存成功",
                    buttonName: "确定",
                    cancelable: 1,
                    h5UI: false, // 是否强制使用H5-UI效果，默认false
                    success: function (result) {
                        ejs.page.close(JSON.stringify({ key: 'value2' }));
                    },
                    error: function (err) { }
                });
            })

    }
    /**
 * @description 获取动态检查项列表
 */
    function getDynamicScoreList(url) {
        Util.ajax({
            url: Config.serverUrl + url,
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dtyguid: dutyguid,
                    optguid: optguid,
                    opttype: opttype
                }
            }),
            contentType: 'application/json',
            success: function (res) {
                console.log(res)

                // 处理数据
                if (res.status.code != 200) {
                    ejs.ui.toast(res.status.text);
                    return false;
                }
                var html = Mustache.render($('#item-tpl').html(), res.custom);
                $('#dynamicscorelist').append(html).removeClass('hidden');

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
 * @description 任务更新
 */
    function updateTask(status) {
        Util.ajax({
            url: Config.serverUrl + 'risktask/saveCheckResult',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: dutyguid,
                    status: status,
                    userguid: userguid,
                }
            }),
            contentType: 'application/json',
            success: function (res) {
                console.log(res)

                // 处理数据
                if (res.status.code != 1) {
                    ejs.ui.toast(res.status.text);
                    return false;
                }

                ejs.ui.alert({
                    title: "提示",
                    message: "提交成功",
                    buttonName: "确定",
                    cancelable: 1,
                    h5UI: false, // 是否强制使用H5-UI效果，默认false
                    success: function (result) {
                        ejs.page.close(JSON.stringify({ key: 'value2' }));
                    },
                    error: function (err) { }
                });

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
     * @description 获取评定总分
     */
    function getSaveCheckResult() {
        Util.ajax({
            url: Config.serverUrl + 'risktask/getSaveCheckResult',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    optguid: optguid,
                    opttype: opttype
                }
            }),
            contentType: 'application/json',
            success: function (res) {
                console.log(res)

                // 处理数据
                if (res.status.code != 200) {
                    ejs.ui.toast(res.status.text);
                    return false;
                }

                $('#grade').text(res.custom.Grade);

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
            url: Config.serverUrl + 'risktask/getSelectedCheckItemList',
            template: '#item-template',
            initPageIndex: 0,
            listContainer: '#listdata',
            contentType: 'application/json;charset=UTF-8',
            // contentType: 'application/x-www-form-urlencoded',
            dataRequest: function (currPage) {
                var requestData = JSON.stringify({
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        dtyguid: dutyguid,
                        activityguid: "",
                        optguid: optguid,
                        opttype: opttype,
                        currentpageindex: currPage.toString(),
                        pagesize: 10
                    }
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {
                // console.log(JSON.stringify(res), res);
                return res.custom.checkcontentlist;
            },
            success: function (res) {
                switch (status) {
                    case '50':
                    case '100':
                        $('.checklist-opbtn').addClass('hidden')
                        break;
                    default:
                        $('#listdata #statusbtn').forEach((ele, i) => {
                            $(ele).text($('.active').text().split('待')[1])
                        })
                }
            },
            itemClick: function (e) {

            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }

})(document, Zepto);