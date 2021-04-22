/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：风险分级评定详情-待接收 待反馈详情
 **/

(function (d, $) {
    'use strict';

    var statustext = decodeURI(Util.getExtraDataByKey('status')) || '',
        dutyguid = Util.getExtraDataByKey('dutyguid') || '',
        userGuid = '',
        status = '',
        opttype = '',
        optname = '',
        optguid = '';
    console.log(statustext)

    Util.loadJs(
        // 下拉刷新
        'js/widgets/tabview/tabview.js',
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
        //设置头部状态和底部按钮
        // $('.detail-status').text(status);
        // $('#statusbtn').text(status.split('待')[1]);

        // 初始化事件监听
        initListeners();
        getInfo();

    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            .on('tap', '.file-info-downloadicon', function (e) {
                var url = this.dataset.url,
                    name = this.dataset.name;
                // 调用ejsapi下载
                ejs.ui.showWaiting('正在加载...');
                ejs.io.downloadFile({
                    url: url,
                    fileName: filename,
                    reDownloaded: 1,
                    success: function (result) {
                        ejs.ui.closeWaiting();
                    },
                    error: function (error) { }
                });
            })
            // 点击跳转
            .on('tap', '#handlelist', function (e) {
                console.log(this.dataset.url)
                if (this.dataset.url) {
                    ejs.page.open(this.dataset.url, {
                        dutyguid: dutyguid,
                        opttype: opttype,
                        optguid: optguid,
                        urlajax: 'risktask/getDynamicScoreList'
                    })
                }
            })

    }

    /**
 * @description 获取基本信息
 */
    function getInfo() {
        Util.ajax({
            url: Config.serverUrl + 'task/getTaskDetail',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: dutyguid,
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

                opttype = res.custom.opttype;
                optguid = res.custom.optguid;
                optname = res.custom.optname;
                status = res.custom.status;

                var html = Mustache.render($('#detail-tpl').html(), res.custom);
                $('#detail').html(html);

                $('.detail-status').text(res.custom.statustext);


                new TabView({
                    container: "#em-tabview-con",
                    activeCls: "cur",
                    isSwipe: false,
                    activeIndex: 0,
                    triggerEvent: 'tap',
                    itemClick: function (e) { }
                });

                getAttachList(res.custom.taskclientguid);
                getCheckResult();
                getExamineInfo();

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
        * @description 获取附件列表
        */
    function getAttachList(guid) {
        Util.ajax({
            url: Config.serverUrl + 'attach/getAttachList',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    "clientguid": guid
                    // '724d2b6b-04ff-4beb-8980-eab30e2c314d'
                    // guid
                }
            }),
            contentType: 'application/json',

            success: function (res) {
                console.log(res);
                if (res.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }
                var html = Mustache.render($('#taskattach-tpl').html(), res.custom);
                $('#taskattach').html(html);

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
    //检查结果查询
    function getCheckResult() {
        Util.ajax({
            url: Config.serverUrl + 'risktask/getCheckResult',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dtyguid: dutyguid,
                    optguid: optguid,
                    opttype: opttype
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
                var resultobj = res.custom;
                for (var i in resultobj) {
                    $(`#checkResult #${i}`).text(resultobj[i]);
                }

            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

    //审核信息
    function getExamineInfo() {
        Util.ajax({
            url: Config.serverUrl + 'risktask/getExamineInfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dtyguid: dutyguid,
                    optguid: optguid,
                    opttype: opttype
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
                var resultobj = res.custom;
                for (var i in resultobj) {
                    if (resultobj[i]) {
                        $(`#examineInfo #${i}`).text(resultobj[i]);
                    } else {
                        $(`#examineInfo #${i}`).removeClass('pass').text('暂无');
                    }
                }
                if (statustext == '待审核') {
                    $('.completed').addClass('hidden');
                }

            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

})(document, Zepto);