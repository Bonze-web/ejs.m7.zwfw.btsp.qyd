/**
 * 作者：范周静
 * 创建时间：2019-05-13 08:56:59
 * 版本：[1.0, 2019-05-13]
 * 版权：江苏国泰新点软件有限公司
 * 描述：列表
 **/

(function (d, $) {
    'use strict';

    var rowGuid = '',
        userGuid = '';

    var transferType = '',
        sendUserguid = '';

    Util.loadJs(
        // 下拉刷新
        'js/widgets/tabview/tabview.js',
        function () {
            ejs.config({
                jsApiList: []
            });

            ejs.ready(function () {
                rowGuid = Util.getExtraDataByKey('rowguid') || '111';
                userGuid = Util.getExtraDataByKey('userguid');
                initPage()
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        // 初始化事件监听
        initListeners();

        new TabView({
            container: "#em-tabview-con",
            activeCls: "cur",
            isSwipe: false,
            activeIndex: 0,
            triggerEvent: 'tap',
            itemClick: function (e) {}
        });

        getDetail();
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body').on('tap', '.operationbtn', function (event) {

            var optName = $(this).text();

            if (optName == '退回') {
                ejs.page.open("./dailycheck_yijiaoback.html", {
                    guid: rowGuid,
                    userguid: userGuid,
                    transfertype: transferType,
                    senduserguid: sendUserguid
                });
            } else if (optName == '接收') {
                ejs.page.open("./dailycheck_yijiaoget.html", {
                    guid: rowGuid,
                    userguid: userGuid,
                    transfertype: transferType,
                    senduserguid: sendUserguid
                });
            }
        })

        // 检查要点文档下载
        $('#checkimport').on('tap', '.file-info-downloadicon', function () {
            var type = $(this).data('type');

            getDownloadUrl(type)
        })

        // 详情附件
        $('#taskattach').on('tap','.file-info-downloadicon',function(){
            var url = $(this).data('attachurl'),
                filename = $(this).data('attachname');

            // 调用ejsapi下载
            ejs.ui.showWaiting('正在加载...');
            ejs.io.downloadFile({
                url: url,
                fileName: filename,
                reDownloaded: 1,
                success: function(result) {
                    ejs.ui.closeWaiting();
                },
                error: function(error) {}
            });
        })
    }


    function getDownloadUrl(type) {
        Util.ajax({
            url: Config.serverUrl + 'attach/downloadCheckTableAttach',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    checktable: type
                }
            }),
            type: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                if (res.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }

                // 调用ejsapi下载
                ejs.ui.showWaiting('正在加载...');
                ejs.io.downloadFile({
                    url: res.custom.attachurl,
                    fileName: res.custom.attachname,
                    reDownloaded: 1,
                    success: function (result) {
                        ejs.ui.closeWaiting();
                    },
                    error: function (error) {}
                });

            },
            error: function (err) {
                ejs.ui.toast(err)
            }
        });
    }

    function getDetail() {
        Util.ajax({
            url: Config.serverUrl + 'task/getTransferInfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid
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

                var handleJson = res.custom;

                transferType = handleJson.transferrecord.transfertype;
                sendUserguid = handleJson.transferrecord.senduserguid;

                console.log($('#detail-con').find('.itemvalue'))

                $('#detail-con').find('.itemvalue').each(function (key, value) {

                    var thisId = $(this).attr('id');

                    $(this).text(handleJson[thisId])
                })

                $('#yijiao-con').find('.itemvalue').each(function (key, value) {

                    var thisId = $(this).attr('id');

                    $(this).text(handleJson.transferrecord[thisId])
                })

                getAttachList(handleJson.taskclientguid)

            },
            error: function (err) {
                ejs.ui.toast(err)
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
})(document, Zepto);