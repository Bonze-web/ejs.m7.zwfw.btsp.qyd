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
        islock = Util.getExtraDataByKey('islock') || '',
        dutyguid = Util.getExtraDataByKey('dutyguid') || '',
        userGuid = '',
        custom = {};

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

        $('.detail-status').text(statustext);
        if (statustext == '移交待接收') {
            $('#transferbtn').text('退回');
        }
        $('#statusbtn').text(statustext.split('待')[1]);

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
            // 点击 底部按钮
            .on('tap', '#statusbtn', function (e) {
                if (statustext == '移交待接收') {
                    if (!custom.transferrecord) {
                        ejs.ui.toast('移交信息为空');
                        return;
                    }
                    ejs.page.open('./risk_transferback.html', {
                        dutyguid: dutyguid,
                        handletype: '2',
                        senduserguid: custom.transferrecord.senduserguid,
                        transfertype: custom.transferrecord.transfertype
                    })
                } else if ($(this).text() == '反馈') {
                    ejs.page.open('./risk_feedback.html', {
                        dutyguid: dutyguid,
                        opttype: custom.opttype,
                        optguid: custom.optguid,
                        optname: encodeURI(custom.optname),
                        status: custom.status
                    })
                } else {
                    ejs.ui.confirm({
                        title: "确认",
                        message: "确认接收",
                        buttonLabels: ['取消', '确定'],
                        cancelable: 1,
                        h5UI: false, // 是否强制使用H5-UI效果，默认false
                        success: function (result) {
                            // 点击任意一个按钮都会回调
                            if (result.which == 1) {
                                getItem();
                            }
                        },
                        error: function (err) { }
                    });
                }

            })
            // 点击 底部按钮
            .on('tap', '#transferbtn', function (e) {
                if (statustext == '移交待接收') {
                    if (!custom.transferrecord) {
                        ejs.ui.toast('移交信息为空');
                        return;
                    }
                    ejs.page.open('./risk_transferback.html', {
                        dutyguid: dutyguid,
                        handletype: '1',
                        senduserguid: custom.transferrecord.senduserguid,
                        transfertype: custom.transferrecord.transfertype
                    })
                    return;
                }
                ejs.page.open('./risk_transfer.html', { dutyguid: dutyguid, optguid: custom.optguid, userguid: userGuid })
            })
    }

    /**
 * @description 获取基本信息
 */
    function getInfo() {
        var url = 'task/getTaskDetail';
        if (islock == 1 && (statustext == '待接收' || statustext == '移交待接收')) {
            url = 'task/getTransferInfo'
        }
        Util.ajax({
            url: Config.serverUrl + url,
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
                custom = res.custom;

                // opttype = res.custom.opttype;
                // optguid = res.custom.optguid;
                // optname = res.custom.optname;
                // status = res.custom.status;


                var html = Mustache.render($('#detail-tpl').html(), res.custom);
                $('#detail').html(html);

                if (statustext == '移交待接收') {
                    $('#transferrecord').removeClass('hidden');
                    $('#transferrecord span').forEach((ele, i) => {
                        if (ele.id && custom.transferrecord)
                            $(ele).text(custom.transferrecord[ele.id]);
                    })
                }

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

    //接受检查
    function getItem() {
        Util.ajax({
            url: Config.serverUrl + 'task/updateTask',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: dutyguid,
                    status: '40',
                    userguid: userGuid
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

            },
            error: function (err) {
                ejs.ui.toast(err);
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
                    optguid: custom.optguid,
                    opttype: custom.opttype
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

            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

})(document, Zepto);